import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/checkout",
  verifyToken,
  allowRoles(3), // CASHIER
  (req, res) => {
    res.json({ message: "Sale completed" });
  }
);

export default router;
