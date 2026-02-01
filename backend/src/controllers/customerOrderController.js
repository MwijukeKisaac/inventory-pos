import db from "../config/db.js";

/**
 * Get available products (customer menu)
 */
export const getOnlineMenu = (req, res) => {
  const sql = `
    SELECT product_id, name, price, quantity_in_stock
    FROM products
    WHERE status = 'AVAILABLE' AND quantity_in_stock > 0
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

/**
 * Customer creates an online order
 */
export const createOnlineOrder = (req, res) => {
  const customer_id = req.user.id;

  const sql = `
    INSERT INTO orders 
    (customer_id, order_type, total_amount)
    VALUES (?, 'ONLINE', 0)
  `;

  db.query(sql, [customer_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Online order created",
      order_id: result.insertId
    });
  });
};

/**
 * Customer adds items to online order
 */
export const addItemToOnlineOrder = (req, res) => {
  const { order_id, product_id, quantity } = req.body;

  db.query(
    "SELECT price, quantity_in_stock FROM products WHERE product_id = ?",
    [product_id],
    (err, product) => {
      if (err || product.length === 0)
        return res.status(404).json({ message: "Product not found" });

      if (product[0].quantity_in_stock < quantity)
        return res.status(400).json({ message: "Not enough stock" });

      const unit_price = product[0].price;
      const subtotal = unit_price * quantity;

      db.query(
        `
        INSERT INTO order_items 
        (order_id, product_id, quantity, unit_price, subtotal)
        VALUES (?, ?, ?, ?, ?)
        `,
        [order_id, product_id, quantity, unit_price, subtotal],
        (err) => {
          if (err) return res.status(500).json(err);

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
 * Customer views their orders
 */
export const getCustomerOrders = (req, res) => {
  const customer_id = req.user.id;

  db.query(
    `
    SELECT order_id, status, payment_status, total_amount, created_at
    FROM orders
    WHERE customer_id = ?
    ORDER BY created_at DESC
    `,
    [customer_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

/**
 * Track a single order (details)
 */
export const trackOrder = (req, res) => {
  const { order_id } = req.params;

  db.query(
    `
    SELECT o.order_id, o.status, o.payment_status, o.total_amount,
           p.name, oi.quantity, oi.subtotal
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.order_id = ?
    `,
    [order_id],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(404).json({ message: "Order not found" });

      res.json(results);
    }
  );
};
