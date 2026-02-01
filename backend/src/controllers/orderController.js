import db from "../config/db.js";

/**
 * Create new order (Cash / QR / Online)
 */
export const createOrder = (req, res) => {
  const { customer_id, order_type } = req.body;

  const sql = `
    INSERT INTO orders (customer_id, served_by, order_type, total_amount)
    VALUES (?, ?, ?, 0)
  `;

  db.query(sql, [customer_id, req.user.id, order_type], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Order created",
      order_id: result.insertId
    });
  });
};

/**
 * Add item to order (POS adds items one by one)
 */
export const addOrderItem = (req, res) => {
  const { order_id, product_id, quantity } = req.body;

  // Get product price & stock
  db.query(
    "SELECT price, quantity_in_stock FROM products WHERE product_id = ?",
    [product_id],
    (err, product) => {
      if (err || product.length === 0)
        return res.status(400).json({ message: "Product not found" });

      if (product[0].quantity_in_stock < quantity)
        return res.status(400).json({ message: "Insufficient stock" });

      const unit_price = product[0].price;
      const subtotal = unit_price * quantity;

      // Insert order item
      db.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
        `,
        [order_id, product_id, quantity, unit_price, subtotal],
        (err) => {
          if (err) return res.status(500).json(err);

          // Update order total
          db.query(
            `
            UPDATE orders 
            SET total_amount = total_amount + ?
            WHERE order_id = ?
            `,
            [subtotal, order_id]
          );

          res.json({ message: "Item added to order" });
        }
      );
    }
  );
};
/**
 * Complete order (Cashier confirms sale)
 */
export const completeOrder = (req, res) => {
  const { order_id } = req.body;

  // Get order items
  db.query(
    "SELECT * FROM order_items WHERE order_id = ?",
    [order_id],
    (err, items) => {
      if (err) return res.status(500).json(err);

      // Deduct stock for each item
      items.forEach(item => {
        db.query(
          `
          UPDATE products
          SET quantity_in_stock = quantity_in_stock - ?
          WHERE product_id = ?
          `,
          [item.quantity, item.product_id]
        );

        // Log stock movement
        db.query(
          `
          INSERT INTO stock_logs 
          (product_id, changed_by, change_type, quantity_changed, reason)
          VALUES (?, ?, 'OUT', ?, 'SALE')
          `,
          [item.product_id, req.user.id, item.quantity]
        );
      });

      // Mark order completed
      db.query(
        `
        UPDATE orders 
        SET status = 'COMPLETED', payment_status = 'PAID'
        WHERE order_id = ?
        `,
        [order_id]
      );

      res.json({ message: "Order completed successfully" });
    }
  );
};
/**
 * View all orders
 */
export const getOrders = (req, res) => {
  db.query(
    `
    SELECT o.*, u.full_name AS served_by_name
    FROM orders o
    LEFT JOIN users u ON o.served_by = u.user_id
    ORDER BY o.created_at DESC
    `,
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};
export const getPendingOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE status = 'PENDING' ORDER BY created_at DESC`
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
