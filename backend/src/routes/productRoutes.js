import express from "express";
import { addProduct, getProducts } from "../controllers/productController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, checkRole([1, 2]), addProduct); // Owner & Manager
router.get("/", verifyToken, getProducts);

export default router;
