router.post("/momo-callback", async (req, res) => {
  const { referenceId, status } = req.body;

  if (status === "SUCCESSFUL") {
    await db.query(
      "UPDATE payments SET status='SUCCESS' WHERE reference=?",
      [referenceId]
    );

    await db.query(
      "UPDATE orders SET status='PAID' WHERE id=(SELECT order_id FROM payments WHERE reference=?)",
      [referenceId]
    );
  }

  res.sendStatus(200);
});
