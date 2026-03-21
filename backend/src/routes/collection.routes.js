// backend/src/routes/collection.routes.js
import express from "express";
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collection.controller.js";
import { authenticate_token, authorize_admin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllCollections);
router.get("/:id", getCollectionById);

// Admin only routes
router.post("/", authenticate_token, authorize_admin, createCollection);
router.put("/:id", authenticate_token, authorize_admin, updateCollection);
router.delete("/:id", authenticate_token, authorize_admin, deleteCollection);

export default router;
