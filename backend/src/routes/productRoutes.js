import express from "express";
import { addProduct, getProducts } from "../controllers/productController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all products
router.get("/", verifyToken, getProducts);

// Add new product (Owner & Manager only)
router.post("/", verifyToken, checkRole([1, 2]), addProduct);

export default router;