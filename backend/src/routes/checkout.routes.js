// backend/src/routes/checkout.routes.js

import express from "express";
import crypto from "crypto";

import { checkout } from "../controllers/checkout.controller.js";
import { authenticate_token } from "../middleware/auth.js";
import { cartResolver } from "../middleware/cart_resolver.js";

const router = express.Router();

/* ==============================
   CHECKOUT IDEMPOTENCY MIDDLEWARE
============================== */

const checkoutIdempotency = (req, res, next) => {
  let idempotencyKey = req.headers["idempotency-key"];

  // Если фронт не передал ключ — генерируем
  if (!idempotencyKey) {
    idempotencyKey = crypto.randomUUID();
  }

  req.idempotency_key = idempotencyKey;

  next();
};

/* ==============================
   AUTH REQUIRED
============================== */

router.use(authenticate_token);

/* ==============================
   LOAD CART
============================== */

router.use(cartResolver);

/* ==============================
   CHECKOUT
============================== */

router.post("/", checkoutIdempotency, checkout);

export default router;