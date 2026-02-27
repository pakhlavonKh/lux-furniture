import express from "express";
import { checkout } from "../controllers/checkout.controller.js";
import { authenticate_token } from "../middleware/auth.js";
import { cartResolver } from "../middleware/cart_resolver.js";

const router = express.Router();

// Требуем авторизацию
router.use(authenticate_token);

// Загружаем корзину пользователя
router.use(cartResolver);

// Оформление заказа
router.post("/", checkout);

export default router;