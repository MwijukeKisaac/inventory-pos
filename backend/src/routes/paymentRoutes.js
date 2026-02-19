import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { processPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  checkRole("CASHIER"),
  processPayment
);

export default router;
router.post("/pay", async (req, res) => {
  const { method, phone, amount, orderId } = req.body;

  let reference;

  if (method === "MTN") {
    reference = await requestMtnPayment(phone, amount);
  } else if (method === "AIRTEL") {
    reference = await requestAirtelPayment(phone, amount);
  }

  await db.query(
    "INSERT INTO payments(order_id, method, reference, status) VALUES (?,?,?,?)",
    [orderId, method, reference, "PENDING"]
  );

  res.json({ message: "Payment request sent", reference });
});
