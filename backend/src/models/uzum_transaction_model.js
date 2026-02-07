import mongoose from 'mongoose';

const uzum_transaction_schema = new mongoose.Schema(
  {
    transaction_id: { type: String, required: true, unique: true },
    service_id: { type: Number, required: true },
    account: { type: String },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'CREATED', 'CONFIRMED', 'REVERSED', 'FAILED'],
      default: 'PENDING'
    },
    trans_time: { type: Date },
    confirm_time: { type: Date },
    reverse_time: { type: Date },
    payment_source: { type: String },
    phone: { type: String },
    card_type: { type: Number },
    processing_reference_number: { type: String },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', sparse: true },
  },
  { timestamps: true, collection: 'uzum_transactions' }
);

// Create indexes
uzum_transaction_schema.index({ transaction_id: 1 });
uzum_transaction_schema.index({ service_id: 1 });
uzum_transaction_schema.index({ status: 1 });
uzum_transaction_schema.index({ payment_id: 1 });
uzum_transaction_schema.index({ createdAt: -1 });

export const UzumTransaction = mongoose.model('UzumTransaction', uzum_transaction_schema);
