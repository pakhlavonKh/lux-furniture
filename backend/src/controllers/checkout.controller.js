// backend/src/controllers/checkout.controller.js
import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Discount from "../models/discount.model.js";
import { Payment } from "../models/payment_model.js";
import { reserveStock } from "../services/stock_reservation.service.js";

export const checkout = async (req, res, next) => {

  const session = await mongoose.startSession();

  try {

    await session.startTransaction();

    /* ===========================
       AUTH CHECK
    ============================ */

    if (!req.user_id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required for checkout",
      });
    }

    /* ===========================
       VALIDATE USER DATA
    ============================ */

    const user = await mongoose.model('User').findById(req.user_id).session(session);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required to proceed with checkout",
        code: "MISSING_PHONE",
      });
    }

    if (!user.address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required to proceed with checkout",
        code: "MISSING_ADDRESS",
      });
    }

    /* ===========================
       VALIDATE PAYMENT METHOD
    ============================ */

    const paymentMethod = req.body.paymentMethod;

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    /* ===========================
       1. LOAD CART
    ============================ */

    const cart = await Cart.findOne({ user: req.user_id })
      .populate("items.product")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    /* ===========================
       2. LOAD ACTIVE DISCOUNTS
    ============================ */

    const now = new Date();
    const activeDiscounts = await Discount.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: now } },
      ],
    })
      .lean()
      .session(session);

    /* ===========================
       3. CALCULATE ORDER
    ============================ */

    let subtotal = 0;
    let vatAmount = 0;
    let assemblyTotal = 0;
    let discountAmount = 0;

    const orderItems = [];

    for (const item of cart.items) {

      const product = item.product;

      if (!product || !product.isActive) {
        throw new Error("Product unavailable");
      }

      const variant = product.variants.find(
        (v) => v.sku === item.variantSku && v.isActive
      );

      if (!variant) {
        throw new Error("Variant not found");
      }

      /* ===========================
         STOCK CHECK
      ============================ */

      if (variant.stock < item.quantity) {
        throw new Error("Insufficient stock");
      }

      const price = variant.price;

      /* ===========================
         APPLY PRODUCT DISCOUNT
      ============================ */

      const productId = product._id.toString();
      const applicableDiscount = activeDiscounts
        .filter((d) => d.productIds.includes(productId))
        .sort((a, b) => b.percentage - a.percentage)[0];

      let discountedPrice = price;
      if (applicableDiscount) {
        discountedPrice = Math.round(price * (1 - applicableDiscount.percentage / 100));
        discountAmount += (price - discountedPrice) * item.quantity;
      }

      const itemSubtotal = discountedPrice * item.quantity;

      let assemblyPrice = 0;

      if (item.assemblySelected && product.assemblyAvailable) {

        assemblyPrice = product.assemblyPrice || 0;

        assemblyTotal += assemblyPrice * item.quantity;
      }

      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        nameSnapshot: product.name,
        priceSnapshot: discountedPrice,
        variantSnapshot: {
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
        },
        quantity: item.quantity,
        assemblySelected: item.assemblySelected,
        assemblyPriceSnapshot: assemblyPrice,
        totalItemPrice:
          itemSubtotal + assemblyPrice * item.quantity,
      });
    }

    /* ===========================
       VAT CALCULATION
    ============================ */

    vatAmount = Math.round(subtotal * 0.12);

    const grandTotal =
      subtotal +
      vatAmount +
      assemblyTotal;

    /* ===========================
       4. RESERVE STOCK
    ============================ */

    await reserveStock(cart, session);

    /* ===========================
       5. CREATE ORDER
    ============================ */

    const [order] = await Order.create(
      [
        {
          user: req.user_id,
          items: orderItems,
          subtotal,
          vatAmount,
          assemblyTotal,
          discountAmount,
          deliveryPrice: 0,
          grandTotal,
          currency: "UZS",
          paymentMethod,
          paymentStatus: "pending",
          orderStatus: "created",
          deliveryAddress: req.body.deliveryAddress,
        },
      ],
      { session }
    );

    /* ===========================
       6. CREATE PAYMENT
    ============================ */

    const [payment] = await Payment.create(
      [
        {
          user: req.user_id,
          order: order._id,
          amount: grandTotal,
          currency: "UZS",
          method: paymentMethod,
          status: "pending",
        },
      ],
      { session }
    );

    /* ===========================
       7. LINK PAYMENT
    ============================ */

    order.payment = payment._id;

    await order.save({ session });

    /* ===========================
       8. CLEAR CART
    ============================ */

    cart.items = [];

    await cart.save({ session });

    /* ===========================
       COMMIT TRANSACTION
    ============================ */

    await session.commitTransaction();

    session.endSession();

    return res.status(201).json({
      success: true,
      order,
      payment,
    });

  } catch (error) {

    await session.abortTransaction();

    session.endSession();

    next(error);
  }
};