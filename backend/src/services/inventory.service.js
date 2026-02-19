import db from "../config/db.js";
import { sendLowStockAlerts } from "./alert.service.js";

export async function checkLowStock() {
  const [products] = await db.query(`
    SELECT id, name, quantity, reorder_level
    FROM products
    WHERE quantity <= reorder_level
  `);

  for (const product of products) {
    // Log alert
    await db.query(
      "INSERT INTO stock_alerts (product_id, quantity) VALUES (?, ?)",
      [product.id, product.quantity]
    );

    // Send SMS + Email
    await sendLowStockAlerts(product);
  }
}

export async function checkStock(productName) {
  if (productName.toLowerCase() === "rice") {
    return {
      name: "Rice",
      quantity: 24,
      price: 3500,
    };
  }
  return null;
}
