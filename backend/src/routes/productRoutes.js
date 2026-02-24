const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
    createProduct,
    getProducts,
    updateStock
} = require("../controllers/productController");

router.post("/", auth, role("Manager", "Owner"), createProduct);
router.get("/", auth, getProducts);
router.put("/:id", auth, role("Manager"), updateStock);

module.exports = router;