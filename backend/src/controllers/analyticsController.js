const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
    try {

        const [[totalSales]] = await db.query(`
            SELECT IFNULL(SUM(amount),0) as total_sales
            FROM transactions
        `);

        const [[todaySales]] = await db.query(`
            SELECT IFNULL(SUM(amount),0) as today_sales
            FROM transactions
            WHERE DATE(created_at) = CURDATE()
        `);

        const [[totalOrders]] = await db.query(`
            SELECT COUNT(*) as total_orders
            FROM orders
        `);

        const [[lowStockCount]] = await db.query(`
            SELECT COUNT(*) as low_stock
            FROM products
            WHERE quantity <= low_stock_threshold
        `);

        const [[pendingOrders]] = await db.query(`
            SELECT COUNT(*) as pending
            FROM orders
            WHERE status = 'PENDING'
        `);

        res.json({
            totalSales: totalSales.total_sales,
            todaySales: todaySales.today_sales,
            totalOrders: totalOrders.total_orders,
            lowStock: lowStockCount.low_stock,
            pendingOrders: pendingOrders.pending
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDailySalesChart = async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT DATE(created_at) as date,
                   SUM(amount) as total
            FROM transactions
            GROUP BY DATE(created_at)
            ORDER BY date ASC
            LIMIT 30
        `);

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
