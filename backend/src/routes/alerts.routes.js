router.get("/", async (req, res) => {
  const [alerts] = await db.query(`
    SELECT a.id, p.name, p.quantity, p.reorder_level, a.created_at
    FROM stock_alerts a
    JOIN products p ON p.id = a.product_id
    WHERE a.status='NEW'
    ORDER BY a.created_at DESC
  `);

  res.json(alerts);
});
