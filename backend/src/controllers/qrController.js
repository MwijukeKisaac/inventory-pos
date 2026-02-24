const db = require("../config/db");

exports.getProductByQR = async (req, res) => {
    try {
        const { token } = req.params;

        const [products] = await db.query(`
            SELECT id, name, description, price
            FROM products
            WHERE qr_code = ?
        `, [token]);

        if (!products.length)
            return res.status(404).json({ message: "Invalid QR code" });

        res.json(products[0]);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// guest order creation via QR (no auth required)
exports.createQRGuestOrder = async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const { items, table_number } = req.body;

        const orderNumber = "QR-" + Date.now();

        const [orderResult] = await connection.query(`
            INSERT INTO orders 
            (order_number, order_type, status, payment_status, notes)
            VALUES (?, 'QR', 'PENDING', 'UNPAID', ?)
        `, [orderNumber, `Table ${table_number}`]);

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
        }

        await connection.query(`
            UPDATE orders
            SET total_amount = ?
            WHERE id = ?
        `, [totalAmount, orderId]);

        await connection.commit();

        // notify waiters of new QR order
        if (req.io) {
            req.io.to("Waiter").emit("newOrder", {
                orderNumber,
                totalAmount
            });
        }

        res.json({
            message: "QR Order placed successfully",
            orderNumber,
            totalAmount
        });

    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
};