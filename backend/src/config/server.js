// Get menu for customers
app.get("/api/menu", async (req, res) => {
  const [rows] = await db.execute(
    "SELECT product_id, name, price FROM products WHERE stock > 0"
  );
  res.json(rows);
});
// Place online order
app.post("/api/orders/online", async (req, res) => {
  const { items, table_number } = req.body;

  const [order] = await db.execute(
    "INSERT INTO orders (order_source, table_number) VALUES ('ONLINE', ?)",
    [table_number]
  );

  for (const item of items) {
    await db.execute(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)",
      [order.insertId, item.product_id, item.qty, item.price]
    );
  }

  res.json({ orderId: order.insertId });
});
// Track order status
app.get("/api/orders/:id/status", async (req, res) => {
  const [rows] = await db.execute(
    "SELECT order_status FROM orders WHERE order_id = ?",
    [req.params.id]
  );
  res.json(rows[0]);
});
