// backend/src/routes/discounts.routes.js
import express from "express";
import {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../controllers/discount_controller.js";
import { authenticate_token } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllDiscounts);
router.get("/:id", getDiscountById);

// Protected routes (admin only)
router.post("/", authenticate_token, createDiscount);
router.put("/:id", authenticate_token, updateDiscount);
router.delete("/:id", authenticate_token, deleteDiscount);

export default router;
