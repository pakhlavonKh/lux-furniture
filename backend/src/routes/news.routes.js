// backend/src/routes/news.routes.js
import express from "express";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/news_controller.js";
import { authenticate_token } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllNews);
router.get("/:id", getNewsById);

// Protected routes (admin only)
router.post("/", authenticate_token, createNews);
router.put("/:id", authenticate_token, updateNews);
router.delete("/:id", authenticate_token, deleteNews);

export default router;
