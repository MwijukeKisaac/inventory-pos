const router = require("express").Router();
const { 
    getProductByQR,
    createQRGuestOrder 
} = require("../controllers/qrController");

router.get("/product/:token", getProductByQR);
router.post("/guest-order", createQRGuestOrder);

module.exports = router;