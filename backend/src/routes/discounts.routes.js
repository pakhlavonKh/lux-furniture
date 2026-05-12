// backend/src/routes/discounts.routes.js
import express from "express";
import {
  getAllDiscounts,
  getDiscountById,
  getDiscountForProduct,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../controllers/discount_controller.js";
import { authenticate_token, authorize_admin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllDiscounts);
router.get("/product/:productId", getDiscountForProduct);
router.get("/:id", getDiscountById);

// Protected routes (admin only)
router.post("/", authenticate_token, authorize_admin, createDiscount);
router.put("/:id", authenticate_token, authorize_admin, updateDiscount);
router.delete("/:id", authenticate_token, authorize_admin, deleteDiscount);

export default router;
