import db from "../config/db.js";

/**
 * Dashboard summary cards
 */
export const dashboardSummary = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM orders) AS total_orders,
      (SELECT SUM(total_amount) FROM orders WHERE payment_status='PAID') AS total_sales,
      (SELECT SUM(amount_paid) FROM payments WHERE payment_method='CASH') AS cash_sales,
      (SELECT SUM(amount_paid) FROM payments WHERE payment_method='MOBILE_MONEY') AS mobile_money_sales
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
};
export const salesByDateRange = (req, res) => {
  const { start_date, end_date } = req.body;

  const sql = `
    SELECT DATE(created_at) AS sale_date,
           SUM(total_amount) AS total_sales
    FROM orders
    WHERE payment_status='PAID'
      AND DATE(created_at) BETWEEN ? AND ?
    GROUP BY DATE(created_at)
    ORDER BY sale_date
  `;

  db.query(sql, [start_date, end_date], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
export const salesByPaymentMethod = (req, res) => {
  const sql = `
    SELECT payment_method,
           SUM(amount_paid) AS total
    FROM payments
    WHERE payment_status='SUCCESS'
    GROUP BY payment_method
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
export const bestSellingProducts = (req, res) => {
  const sql = `
    SELECT p.name,
           SUM(oi.quantity) AS total_sold,
           SUM(oi.subtotal) AS revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY p.product_id
    ORDER BY total_sold DESC
    LIMIT 10
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
export const salesPerCashier = (req, res) => {
  const sql = `
    SELECT u.full_name AS cashier,
           COUNT(o.order_id) AS orders_handled,
           SUM(o.total_amount) AS total_sales
    FROM orders o
    JOIN users u ON o.served_by = u.user_id
    WHERE o.payment_status='PAID'
    GROUP BY u.user_id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
export const profitReport = (req, res) => {
  const sql = `
    SELECT 
      SUM(oi.subtotal) AS total_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    WHERE o.payment_status='PAID'
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json({
      total_revenue: results[0].total_revenue,
      note: "Add cost_price to products for exact profit"
    });
  });
};
