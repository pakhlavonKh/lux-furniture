import mongoose from "mongoose";

/* ===========================
   CONSTANTS
=========================== */

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

export const PAYMENT_METHOD = {
  PAYME: "payme",
  CLICK: "click",
  UZUM: "uzum",
};

/* ===========================
   SCHEMA
=========================== */

const paymentSchema = new mongoose.Schema(
  {
    /* Relations */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    /* Financial */

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "UZS",
      enum: ["UZS", "USD", "EUR"],
    },

    method: {
      type: String,
      required: true,
      enum: Object.values(PAYMENT_METHOD),
      index: true,
    },

    status: {
      type: String,
      default: PAYMENT_STATUS.PENDING,
      enum: Object.values(PAYMENT_STATUS),
      index: true,
    },

    /* Provider Data */

    transaction_id: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    provider_payload: {
      type: mongoose.Schema.Types.Mixed,
    },

    completed_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "payments",
  }
);

/* ===========================
   INDEXES (PRODUCTION SAFE)
=========================== */

// Быстрый доступ к заказам пользователя
paymentSchema.index({ user: 1, createdAt: -1 });

// Быстрый доступ к платежам по заказу
paymentSchema.index({ order: 1 });

// Быстрый поиск по статусу
paymentSchema.index({ status: 1 });

// По способу оплаты
paymentSchema.index({ method: 1 });

// Уникальность transaction_id уже обеспечена

/* ===========================
   MODEL EXPORT
=========================== */

export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);