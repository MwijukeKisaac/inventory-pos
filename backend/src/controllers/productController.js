import db from "../config/db.js";

export const addProduct = (req, res) => {
  const { name, category_id, price, quantity } = req.body;

  const sql = `
    INSERT INTO products (name, category_id, price, quantity_in_stock, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, category_id, price, quantity, req.user.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Product added successfully" });
  });
};

export const getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
