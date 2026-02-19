router.get("/", allowRoles("ADMIN"), async (req, res) => {
  const [logs] = await db.query(`
    SELECT a.*, u.name
    FROM audit_logs a
    LEFT JOIN users u ON u.id = a.user_id
    ORDER BY a.created_at DESC
    LIMIT 500
  `);

  res.json(logs);
});
