import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin registers users
router.post(
  "/register",
  verifyToken,
  allowRoles("ADMIN"),
  registerUser
);

// Login
router.post("/login", loginUser);

export default router;
