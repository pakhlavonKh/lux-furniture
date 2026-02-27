// order.model.js
import mongoose from "mongoose";

/* ===========================
   ORDER ITEM
=========================== */

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    nameSnapshot: {
      type: String,
      required: true,
    },

    priceSnapshot: {
      type: Number,
      required: true,
      min: 0,
    },

    variantSnapshot: {
      sku: String,
      color: String,
      size: String,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    assemblySelected: {
      type: Boolean,
      default: false,
    },

    assemblyPriceSnapshot: {
      type: Number,
      min: 0,
    },

    totalItemPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

/* ===========================
   MAIN ORDER
=========================== */

const OrderSchema = new mongoose.Schema(
  {
    /* Relations */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      index: true,
    },

    /* Business ID */

    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    /* Items */

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    /* Totals */

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    vatAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    assemblyTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "UZS",
      enum: ["UZS", "USD", "EUR"],
    },

    /* Payment */

    paymentMethod: {
      type: String,
      enum: ["payme", "click", "uzum"],
      required: true,
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    /* Order Lifecycle */

    orderStatus: {
      type: String,
      enum: [
        "created",
        "confirmed",
        "in_production",
        "ready",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "created",
      index: true,
    },

    /* Delivery */

    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  { timestamps: true }
);

/* ===========================
   INDEXES
=========================== */

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

/* ===========================
   ORDER NUMBER GENERATION
=========================== */

OrderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber =
      "ORD-" +
      Date.now().toString().slice(-6) +
      "-" +
      Math.floor(Math.random() * 1000);
  }
  next();
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);