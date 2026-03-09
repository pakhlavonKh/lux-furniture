// backend/src/models/payment_model.js
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
    /* ===========================
       RELATIONS
    ============================ */

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

    /* ===========================
       FINANCIAL
    ============================ */

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

    /* ===========================
       IDEMPOTENCY (CRITICAL)
    ============================ */

    idempotency_key: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    /* ===========================
       PROVIDER DATA
    ============================ */

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

// Быстрый поиск по transaction_id
paymentSchema.index({ transaction_id: 1 });

// Быстрый поиск по idempotency_key
paymentSchema.index({ idempotency_key: 1 });

/* ===========================
   HOOKS
=========================== */

// Автоматически выставляем completed_at
paymentSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === PAYMENT_STATUS.COMPLETED &&
    !this.completed_at
  ) {
    this.completed_at = new Date();
  }

  next();
});

/* ===========================
   METHODS
=========================== */

paymentSchema.methods.isCompleted = function () {
  return this.status === PAYMENT_STATUS.COMPLETED;
};

paymentSchema.methods.isPending = function () {
  return this.status === PAYMENT_STATUS.PENDING;
};

/* ===========================
   MODEL EXPORT
=========================== */

export const Payment =
  mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);