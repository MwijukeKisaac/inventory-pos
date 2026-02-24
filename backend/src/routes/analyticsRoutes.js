const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
    getDashboardStats,
    getDailySalesChart
} = require("../controllers/analyticsController");

router.get("/stats", auth, getDashboardStats);
router.get("/sales-chart", auth, role("Owner"), getDailySalesChart);

module.exports = router;
