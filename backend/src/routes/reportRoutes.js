import express from "express";
import db from "../config/db.js";
import { verifyToken, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Owner = 1
 * Manager = 2
 */

// Sales summary (today & month)
router.get(
  "/summary",
  verifyToken,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const [today] = await db.query(`
        SELECT SUM(total) as total
        FROM orders
        WHERE status='PAID' AND DATE(created_at)=CURDATE()
      `);

      const [month] = await db.query(`
        SELECT SUM(total) as total
        FROM orders
        WHERE status='PAID' 
        AND MONTH(created_at)=MONTH(CURDATE())
      `);

      res.json({
        today: today[0].total || 0,
        month: month[0].total || 0
      });
    } catch (err) {
      console.error("Error fetching sales summary:", err);
      res.status(500).json({ error: "Failed to fetch sales summary" });
    }
  }
);

// Sales per day (chart)
router.get(
  "/sales-daily",
  verifyToken,
  allowRoles("ADMIN", "MANAGER"),
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT DATE(created_at) as date,
               SUM(total) as total
        FROM orders
        WHERE status='PAID'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      res.json(rows);
    } catch (err) {
      console.error("Error fetching daily sales:", err);
      res.status(500).json({ error: "Failed to fetch daily sales" });
    }
  }
);

// Top-selling products
router.get(
  "/top-products",
  verifyToken,
  allowRoles("ADMIN", "MANAGER"),
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT p.name, SUM(oi.quantity) as qty
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        GROUP BY oi.product_id
        ORDER BY qty DESC
        LIMIT 5
      `);

      res.json(rows);
    } catch (err) {
      console.error("Error fetching top products:", err);
      res.status(500).json({ error: "Failed to fetch top products" });
    }
  }
);

// Profit report
router.get(
  "/profit",
  verifyToken,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          SUM((oi.price - p.cost_price) * oi.quantity) AS profit
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        JOIN orders o ON o.id = oi.order_id
        WHERE o.status='PAID'
      `);

      res.json({ profit: rows[0].profit || 0 });
    } catch (err) {
      console.error("Error fetching profit report:", err);
      res.status(500).json({ error: "Failed to fetch profit report" });
    }
  }
);

export default router;
