// backend/src/middleware/cart_resolver.js

import Cart from "../models/cart.model.js";

/* ===========================
   CART RESOLVER
=========================== */

export const cartResolver = async (req, res, next) => {
  try {
    const guestId = req.headers["x-guest-id"];
    const userId = req.user?._id;

    if (!userId && !guestId) {
      return res.status(400).json({
        success: false,
        message: "No user or guest identifier provided",
      });
    }

    let cart;

    /* ===========================
       USER CART
    ============================ */

    if (userId) {
      cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = await Cart.create({
          user: userId,
          items: [],
        });
      }
    }

    /* ===========================
       GUEST CART
    ============================ */

    else {
      cart = await Cart.findOne({ guestId });

      if (!cart) {
        cart = await Cart.create({
          guestId,
          items: [],
        });
      }
    }

    req.cart = cart;

    next();

  } catch (error) {
    next(error);
  }
};