// cart.routes.js
import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

import { cartResolver } from "../middleware/cart_resolver.js";
import { optional_auth } from "../middleware/auth.js";

const router = express.Router();

// поддержка guest + user
router.use(optional_auth);

// загрузка/создание корзины
router.use(cartResolver);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/item", removeFromCart);

export default router;