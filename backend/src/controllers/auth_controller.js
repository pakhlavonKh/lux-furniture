// src/controllers/auth_controller.js

import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import User from "../models/user_model.js";
import telegramService from "../services/telegram_service.js";

/* ===========================
   JWT GENERATION (PRODUCTION SAFE)
   Используем стандартное поле "sub"
=========================== */

const generateToken = (userId) => {
  return jwt.sign(
    { sub: userId.toString() }, // ← стандарт JWT
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRES_IN,
    }
  );
};

/* ===========================
   LOGIN
=========================== */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.last_login_at = new Date();
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone || null,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error:
        config.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ===========================
   REGISTER
=========================== */

export const register = async (req, res) => {
  try {
    const { email, password, name, admin_key } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, password and name are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    /* ===== Admin key logic ===== */

    let isAdmin = false;

    if (admin_key) {
      const ADMIN_KEY = process.env.ADMIN_KEY;

      if (!ADMIN_KEY) {
        return res.status(500).json({
          success: false,
          message: "Admin key not configured",
        });
      }

      if (admin_key !== ADMIN_KEY) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin key",
        });
      }

      isAdmin = true;
    }

    const user = new User({
      email: normalizedEmail,
      password,
      name: name.trim(),
      is_admin: isAdmin,
    });

    await user.save();

    /* ===== Telegram Notification ===== */

    try {
      await telegramService.notifyUserRegistration({
        email: user.email,
        name: user.name,
        isAdmin: user.is_admin,
      });
    } catch (tgError) {
      console.warn("Telegram notify failed:", tgError.message);
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone || null,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error:
        config.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ===========================
   LOGOUT
=========================== */

export const logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};