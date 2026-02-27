// src/controllers/users.controller.js

import User from "../models/user_model.js";

/* ===========================
   GET CURRENT USER
=========================== */

export const getMe = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.user._id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   UPDATE CURRENT USER
=========================== */

export const updateMe = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, phone } = req.body;

    const updates = {};

    if (typeof name === "string") {
      updates.name = name.trim();
    }

    if (typeof phone === "string") {
      updates.phone = phone.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};