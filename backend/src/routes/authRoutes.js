import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { logAudit } from "../services/audit.service.js";
import { registerUser } from "../controllers/authController.js";
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
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      // Failed login attempt
      await logAudit({
        userId: null,
        role: "UNKNOWN",
        action: "FAILED_LOGIN",
        details: `Attempt with ${email}`,
        ip: req.ip,
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Failed login attempt
      await logAudit({
        userId: null,
        role: "UNKNOWN",
        action: "FAILED_LOGIN",
        details: `Attempt with ${email}`,
        ip: req.ip,
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Login success
    await logAudit({
      userId: user.id,
      role: user.role,
      action: "LOGIN",
      details: "User logged in",
      ip: req.ip,
    });

    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
