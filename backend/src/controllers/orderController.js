const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.createOrder = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const { items, order_type, payment_method } = req.body;

        const orderNumber = "ORD-" + Date.now();

        const [orderResult] = await connection.query(`
            INSERT INTO orders 
            (order_number, customer_id, handled_by, order_type, status, payment_status)
            VALUES (?, ?, ?, ?, 'CONFIRMED', 'PAID')
        `, [
            orderNumber,
            req.user.id,
            req.user.id,
            order_type || "MANUAL"
        ]);

        const orderId = orderResult.insertId;
        let totalAmount = 0;

        for (let item of items) {

            const [productData] = await connection.query(
                "SELECT * FROM products WHERE id = ?",
                [item.product_id]
            );

            const product = productData[0];

            if (!product || product.quantity < item.quantity)
                throw new Error("Insufficient stock");

            const subtotal = product.price * item.quantity;
            totalAmount += subtotal;

            await connection.query(`
                INSERT INTO order_items 
                (order_id, product_id, quantity, price, subtotal)
                VALUES (?, ?, ?, ?, ?)
            `, [orderId, item.product_id, item.quantity, product.price, subtotal]);

            await connection.query(`
                UPDATE products 
                SET quantity = quantity - ?
                WHERE id = ?
            `, [item.quantity, item.product_id]);

            await connection.query(`
                INSERT INTO stock_movements 
                (product_id, quantity, movement_type, performed_by)
                VALUES (?, ?, 'OUT', ?)
            `, [item.product_id, item.quantity, req.user.id]);

            // emit low-stock alert if threshold reached
            try {
                const remaining = product.quantity - item.quantity;
                const threshold = product.low_stock_threshold || 0;
                if (remaining <= threshold && req.io) {
                    req.io.to("Manager").emit("lowStock", {
                        productName: product.name,
                        remaining
                    });
                }
            } catch (emitErr) {
                console.warn("Low stock emit failed:", emitErr.message);
            }
        }

        await connection.query(`
            UPDATE orders
            SET total_amount = ?
            WHERE id = ?
        `, [totalAmount, orderId]);

        await connection.query(`
            INSERT INTO transactions 
            (order_id, amount, payment_method, received_by)
            VALUES (?, ?, ?, ?)
        `, [orderId, totalAmount, payment_method, req.user.id]);

        const receiptNumber = "REC-" + uuidv4();

        await connection.query(`
            INSERT INTO receipts (receipt_number, order_id, issued_by)
            VALUES (?, ?, ?)
        `, [receiptNumber, orderId, req.user.id]);

        await connection.commit();

        // notify owner dashboard with updated sales
        try {
            const [[updatedStats]] = await connection.query(`
                SELECT IFNULL(SUM(amount),0) as total_sales
                FROM transactions
            `);

            if (req.io) {
                req.io.to("Owner").emit("dashboardUpdate", updatedStats);
            }
        } catch (statsErr) {
            console.warn("Failed to fetch/emit dashboard stats:", statsErr.message);
        }

        // emit events when payment/receipt completed
        if (req.io) {
            try {
                req.io.to("Owner").emit("orderPaid", {
                    orderNumber,
                    totalAmount
                });

                req.io.to("Waiter").emit("orderPaid", {
                    orderNumber
                });
            } catch (emitErr) {
                console.warn("Socket emit failed:", emitErr.message);
            }
        }

        res.json({
            message: "Order completed successfully",
            orderNumber,
            receiptNumber,
            totalAmount
        });

    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};

// mark order as confirmed by current user
exports.confirmOrder = async (req, res) => {
    const { orderId } = req.params;

    await db.query(`
        UPDATE orders
        SET status = 'CONFIRMED', handled_by = ?
        WHERE id = ?
    `, [req.user.id, orderId]);

    // notify cashiers that order was confirmed
    if (req.io) {
        try {
            req.io.to("Cashier").emit("orderConfirmed", {
                orderId
            });
        } catch (emitErr) {
            console.warn("Socket emit failed:", emitErr.message);
        }
    }

    res.json({ message: "Order confirmed" });
};