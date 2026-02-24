const db = require("../config/db");

exports.openRegister = async (req, res) => {
    const { opening_balance } = req.body;

    await db.query(`
        INSERT INTO cash_register (opened_by, opening_balance)
        VALUES (?, ?)
    `, [req.user.id, opening_balance]);

    res.json({ message: "Register opened" });
};

exports.closeRegister = async (req, res) => {
    const { closing_balance } = req.body;

    await db.query(`
        UPDATE cash_register
        SET closing_balance = ?, status = 'CLOSED', closed_at = NOW()
        WHERE opened_by = ? AND status = 'OPEN'
    `, [closing_balance, req.user.id]);

    res.json({ message: "Register closed" });
};