// src/middleware/auth.js

import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import User from "../models/user_model.js";

/* ===========================
   STRICT AUTH (REQUIRED)
=========================== */

export const authenticate_token = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.JWT_SECRET);

    // ✅ ВАЖНО: используем sub
    const userId = decoded.sub;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.user_id = user._id;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

/* ===========================
   OPTIONAL AUTH
=========================== */

export const optional_auth = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.JWT_SECRET);

    // ✅ используем sub
    const userId = decoded.sub;

    if (!userId) {
      return next();
    }

    const user = await User.findById(userId).select("-password");

    if (user) {
      req.user = user;
      req.user_id = user._id;
    }

    next();
  } catch {
    next();
  }
};

/* ===========================
   ADMIN CHECK
=========================== */

export const authorize_admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};