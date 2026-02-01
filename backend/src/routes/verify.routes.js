router.get("/:receiptNo", async (req, res) => {
  const { receiptNo } = req.params;

  const [rows] = await db.query(
    "SELECT * FROM receipts WHERE receipt_no=?",
    [receiptNo]
  );

  if (rows.length === 0) {
    return res.json({ valid: false });
  }

  res.json({
    valid: true,
    receipt: rows[0],
  });
});
