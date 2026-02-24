const db = require("../config/db");

exports.dailySales = async (req, res) => {
    const [data] = await db.query(`
        SELECT DATE(created_at) as date,
               SUM(amount) as total_sales
        FROM transactions
        GROUP BY DATE(created_at)
        ORDER BY date DESC
    `);

    res.json(data);
};

exports.totalCashInSystem = async (req, res) => {
    const [data] = await db.query(`
        SELECT SUM(amount) as total_cash
        FROM transactions
    `);

    res.json(data[0]);
};