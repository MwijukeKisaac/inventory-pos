import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/order",
  verifyToken,
  allowRoles(5), // CUSTOMER
  (req, res) => {
    res.json({ message: "Order placed successfully" });
  }
);

export default router;
