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
