import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

// Get orders by status (optional query param)
router.get(
  "/",
  verifyToken,
  allowRoles("ADMIN", "MANAGER", "CASHIER"),
  async (req, res) => {
    try {
      const { status } = req.query;

      const query = status
        ? "SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC"
        : "SELECT * FROM orders ORDER BY created_at DESC";

      const [rows] = await db.query(query, status ? [status] : []);
      res.json({ success: true, orders: rows });
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }
);

// Create new order
router.post(
  "/",
  verifyToken,
  allowRoles("CASHIER", "WAITER"),
  createOrder
);

// Waiter confirms order
router.put(
  "/:id/confirm",
  verifyToken,
  allowRoles("WAITER"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await db.query(
        "UPDATE orders SET status = 'CONFIRMED' WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ success: true, message: "Order confirmed" });
    } catch (err) {
      console.error("Error confirming order:", err);
      res.status(500).json({ error: "Failed to confirm order" });
    }
  }
);

// Cashier marks order as paid
router.put(
  "/:id/pay",
  verifyToken,
  allowRoles("CASHIER"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await db.query(
        "UPDATE orders SET status = 'PAID' WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ success: true, message: "Order marked as paid" });
    } catch (err) {
      console.error("Error marking order as paid:", err);
      res.status(500).json({ error: "Failed to mark order as paid" });
    }
  }
);

export default router;
