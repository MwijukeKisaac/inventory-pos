import AfricasTalking from "africastalking";
import nodemailer from "nodemailer";

// -------- SMS SETUP --------
const africasTalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

// -------- EMAIL SETUP --------
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -------- MAIN ALERT FUNCTION --------
export async function sendLowStockAlerts(product) {
  const message = `LOW STOCK ALERT 🚨
Product: ${product.name}
Remaining Qty: ${product.quantity}
Reorder Level: ${product.reorder_level}`;

  try {
    // 1️⃣ SEND SMS
    await africasTalking.SMS.send({
      to: [process.env.ADMIN_PHONE],
      message,
    });

    // 2️⃣ SEND EMAIL
    await transporter.sendMail({
      from: `"POS System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "🚨 Low Stock Alert",
      text: message,
    });

    console.log(`Alerts sent for ${product.name}`);
  } catch (error) {
    console.error("Alert sending failed:", error.message);
  }
}
import { sendWhatsAppAlert } from "./whatsapp.service.js";
import { sendLowStockAlerts } from "./alert.service.js";

export async function sendAllAlerts(product) {
  const message = `🚨 LOW STOCK ALERT
Product: ${product.name}
Remaining: ${product.quantity}
Reorder Level: ${product.reorder_level}`;

  // SMS + Email (existing)
  await sendLowStockAlerts(product);

  // WhatsApp
  await sendWhatsAppAlert(message);
}
