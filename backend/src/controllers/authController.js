import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { logAudit } from "../services/audit.service.js";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role]
  );

  res.json({ message: "User registered successfully" });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

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
};
