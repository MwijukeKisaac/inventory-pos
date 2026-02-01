import db from "../config/db.js";
import generateReceiptPDF from "../utils/generateReceipt.js";

/**
 * Generate receipt after payment
 */
export const generateReceipt = async (req, res) => {
  const { order_id } = req.body;

  try {
    const [orders] = await db.execute(
      `
      SELECT o.*, u.full_name AS cashier
      FROM orders o
      JOIN users u ON o.served_by = u.user_id
      WHERE o.order_id = ? AND o.payment_status = 'PAID'
      `,
      [order_id]
    );

    if (orders.length === 0) {
      return res.status(400).json({ message: "Order not paid or not found" });
    }

    const order = orders[0];

    const [items] = await db.execute(
      `
      SELECT p.name, oi.quantity, oi.unit_price, oi.subtotal
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
      `,
      [order_id]
    );

    const receiptNumber = `RCT-${Date.now()}`;

    const pdfPath = await generateReceiptPDF({
      receipt_number: receiptNumber,
      order_id,
      cashier: order.cashier,
      items,
      total: order.total_amount
    });

    await db.execute(
      `
      INSERT INTO receipts 
      (order_id, receipt_number, receipt_url, total_amount, issued_by, issued_at)
      VALUES (?, ?, ?, ?, ?, NOW())
      `,
      [order_id, receiptNumber, pdfPath, order.total_amount, req.user.id]
    );

    res.status(201).json({
      message: "Receipt generated successfully",
      receipt_number: receiptNumber,
      receipt_url: pdfPath
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Receipt generation failed" });
  }
};

/**
 * Verify receipt (QR scan)
 */
export const verifyReceipt = async (req, res) => {
  const { receiptNumber } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        r.receipt_number,
        r.total_amount,
        r.issued_at,
        p.payment_method,
        p.payment_status,
        o.order_id
      FROM receipts r
      JOIN orders o ON r.order_id = o.order_id
      JOIN payments p ON p.order_id = o.order_id
      WHERE r.receipt_number = ?
      `,
      [receiptNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ valid: false });
    }

    res.json({
      valid: true,
      ...rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
};
