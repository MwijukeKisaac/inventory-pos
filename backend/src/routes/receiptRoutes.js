import express from "express";
import generateReceiptPDF from "../utils/generateReceipt.js";
import db from "../config/db.js";

const router = express.Router();

router.post("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    // 1. Fetch order
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE id=?",
      [orderId]
    );
    const order = orders[0];

    // 2. Fetch items
    const [items] = await db.query(
      `SELECT p.name, oi.qty, oi.price
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id=?`,
      [orderId]
    );

    const receiptNo = `RCPT-${Date.now()}`;

    const pdfPath = await generateReceiptPDF({
      receipt_number: receiptNo,
      order_id: orderId,
      items,
      total: order.total,
    });

    // 3. Save receipt
    await db.query(
      `INSERT INTO receipts (receipt_no, order_id, total, pdf_path)
       VALUES (?, ?, ?, ?)`,
      [receiptNo, orderId, order.total, pdfPath]
    );

    res.json({
      success: true,
      receiptNo,
      pdfPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Receipt generation failed" });
  }
});

router.get("/verify/:receiptNumber", async (req, res) => {
  // Placeholder for verify logic, assuming it exists or needs implementation
  res.json({ message: "Verify endpoint not implemented yet" });
});

export default router;
