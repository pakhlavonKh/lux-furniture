import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import { Payment } from "../models/payment_model.js";
import { reserveStock } from "../services/stock_reservation.service.js";

export const checkout = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    if (!req.user_id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required for checkout",
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
       2. CALCULATE ORDER
    ============================ */

    let subtotal = 0;
    let vatAmount = 0;
    let assemblyTotal = 0;

    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product || !product.isActive) {
        throw new Error("Product unavailable");
      }

      const variant = product.variants.find(
        v => v.sku === item.variantSku && v.isActive
      );

      if (!variant) {
        throw new Error("Variant not found");
      }

      if (variant.stock < item.quantity) {
        throw new Error("Insufficient stock");
      }

      const price = variant.price;
      const itemSubtotal = price * item.quantity;

      let assemblyPrice = 0;

      if (item.assemblySelected && product.assemblyAvailable) {
        assemblyPrice = product.assemblyPrice || 0;
        assemblyTotal += assemblyPrice * item.quantity;
      }

      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        nameSnapshot: product.name,
        priceSnapshot: price,
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

    vatAmount = Math.round(subtotal * 0.12);
    const grandTotal = subtotal + vatAmount + assemblyTotal;

    /* ===========================
       3. RESERVE STOCK
    ============================ */

    await reserveStock(cart, session);

    /* ===========================
       4. CREATE ORDER
    ============================ */

    const [order] = await Order.create(
      [
        {
          user: req.user_id,
          items: orderItems,
          subtotal,
          vatAmount,
          assemblyTotal,
          deliveryPrice: 0,
          grandTotal,
          currency: "UZS",
          paymentMethod: req.body.paymentMethod,
          paymentStatus: "pending",
          orderStatus: "created",
          deliveryAddress: req.body.deliveryAddress,
        },
      ],
      { session }
    );

    /* ===========================
       5. CREATE PAYMENT
    ============================ */

    const [payment] = await Payment.create(
      [
        {
          user: req.user_id,
          order: order._id,
          amount: grandTotal,
          currency: "UZS",
          method: req.body.paymentMethod,
          status: "pending",
        },
      ],
      { session }
    );

    /* ===========================
       6. LINK PAYMENT
    ============================ */

    order.payment = payment._id;
    await order.save({ session });

    /* ===========================
       7. CLEAR CART
    ============================ */

    cart.items = [];
    await cart.save({ session });

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