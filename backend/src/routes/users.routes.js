// src/routes/users.routes.js

import express from "express";
import { authenticate_token } from "../middleware/auth.js";
import { getMe, updateMe } from "../controllers/users.controller.js";

const router = express.Router();

// Preflight safe
router.options("*", (req, res) => res.sendStatus(200));

router.get("/me", authenticate_token, getMe);
router.put("/me", authenticate_token, updateMe);

export default router;