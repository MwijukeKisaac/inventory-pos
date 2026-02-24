const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { createOrder, confirmOrder } = require("../controllers/orderController");

router.post("/", auth, role("Cashier", "Customer"), createOrder);
router.put("/confirm/:orderId", auth, role("Waiter"), confirmOrder);

module.exports = router;