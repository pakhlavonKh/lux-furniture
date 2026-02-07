import mongoose from 'mongoose';

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

export const PAYMENT_METHOD = {
  PAYME: 'payme',
  CLICK: 'click',
  UZUM: 'uzum'
};

const payment_schema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order_id: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'UZS', enum: ['UZS', 'USD', 'EUR'] },
    method: { type: String, required: true, enum: Object.values(PAYMENT_METHOD) },
    status: { type: String, default: PAYMENT_STATUS.PENDING, enum: Object.values(PAYMENT_STATUS) },
    transaction_id: { type: String, unique: true, sparse: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    completed_at: { type: Date },
  },
  { timestamps: true, collection: 'payments' }
);

// Create indexes
payment_schema.index({ user_id: 1 });
payment_schema.index({ order_id: 1 });
payment_schema.index({ transaction_id: 1 });
payment_schema.index({ status: 1 });
payment_schema.index({ method: 1 });
payment_schema.index({ createdAt: -1 });

export const Payment = mongoose.model('Payment', payment_schema);
