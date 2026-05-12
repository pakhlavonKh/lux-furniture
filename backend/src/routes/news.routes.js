// backend/src/routes/news.routes.js
import express from "express";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/news_controller.js";
import { authenticate_token, authorize_admin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllNews);
router.get("/:id", getNewsById);

// Protected routes (admin only)
router.post("/", authenticate_token, authorize_admin, createNews);
router.put("/:id", authenticate_token, authorize_admin, updateNews);
router.delete("/:id", authenticate_token, authorize_admin, deleteNews);

export default router;
