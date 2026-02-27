import express from "express";
import { authenticate_token } from "../middleware/auth.js";
import { getMyOrders } from "../controllers/orders.controller.js";

const router = express.Router();

router.get("/my", authenticate_token, getMyOrders);

export default router;