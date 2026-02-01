import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { items, payment_method } = req.body;

  try {
    const [order] = await db.query(
      "INSERT INTO orders (total, payment_method, status) VALUES (0, ?, 'PENDING')",
      [payment_method]
    );

    let total = 0;

    for (const item of items) {
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [order.insertId, item.id, item.qty, item.price]
      );
      total += item.qty * item.price;
    }

    await db.query(
      "UPDATE orders SET total=? WHERE id=?",
      [total, order.insertId]
    );

    res.json({ orderId: order.insertId, total });
  } catch (err) {
    res.status(500).json({ message: "Order failed" });
  }
});

export default router;
