// backend/src/routes/products.routes.js
import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateVariantStock,
} from "../controllers/products.controller.js";
import { authenticate_token, authorize_admin } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Admin only
router.post("/", authenticate_token, authorize_admin, createProduct);
router.put("/:id", authenticate_token, authorize_admin, updateProduct);
router.delete("/:id", authenticate_token, authorize_admin, deleteProduct);
router.patch("/:id/variants/:sku/stock", authenticate_token, authorize_admin, updateVariantStock);

export default router;
