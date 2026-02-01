import db from "../config/db.js";

/**
 * Process cash or mobile money payment
 */
export const processPayment = async (req, res) => {
  try {
    const { order_id, amount, method } = req.body;

    if (!order_id || !amount || !method) {
      return res.status(400).json({ message: "Missing payment data" });
    }

    await db.query(
      `INSERT INTO payments (order_id, amount, method, status)
       VALUES (?, ?, ?, 'PAID')`,
      [order_id, amount, method]
    );

    await db.query(
      `UPDATE orders SET status = 'PAID' WHERE id = ?`,
      [order_id]
    );

    res.json({ message: "Payment processed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
};
