import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Get available products (menu)
router.get("/", async (req, res) => {
  try {
    const [items] = await db.query(
      "SELECT id, name, price, image FROM products WHERE stock > 0"
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to load menu" });
  }
});

export default router;
