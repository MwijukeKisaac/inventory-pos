import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

/* ===========================
   GET ALL PRODUCTS
=========================== */
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(results);
    }
  });
});

/* ===========================
   CREATE ORDER
=========================== */
app.post("/api/orders", (req, res) => {
  const { customer_id, total_amount } = req.body;

  const sql = "INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)";
  db.query(sql, [customer_id, total_amount], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Order created successfully",
      orderId: result.insertId
    });
  });
});

/* ===========================
   LOGIN
=========================== */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});