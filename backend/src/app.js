import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import customerOrderRoutes from "./routes/customerOrderRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();
require("./cron/salesSummaryJob");
const whatsappRoute = require("./routes/whatsapp");
app.use("/whatsapp", whatsappRoute);

const app = express();

/* ===============================
   MIDDLEWARE
================================ */
// Enable CORS for all origins
app.use(cors({
  origin: "*", // Allow requests from any domain
  methods: ["GET","POST","PUT","DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"] // Optional, for headers
}));

// Parse JSON requests
app.use(express.json());
app.use("/api/menu", menuRoutes);
app.use("/api/customer-orders", customerOrderRoutes);


/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/audit-logs", auditRoutes);

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("✅ POS Backend running");
});

/* ===============================
   SERVER
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
