import mongoose from "mongoose";

/* ===========================
   CART ITEM
=========================== */

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantSku: {
      type: String,
      required: true,
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
  },
  { _id: false }
);

/* ===========================
   MAIN CART
=========================== */

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // один user — одна корзина
      index: true,
    },

    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

/* ===========================
   INDEXES
=========================== */

CartSchema.index({ user: 1 }, { unique: true });

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);