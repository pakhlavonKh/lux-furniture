import mongoose from 'mongoose';

const user_schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, sparse: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password_hash: { type: String, required: true },
    is_email_verified: { type: Boolean, default: false },
    is_phone_verified: { type: Boolean, default: false },
    last_login_at: { type: Date },
  },
  { timestamps: true, collection: 'users' }
);

// Create indexes for performance
user_schema.index({ email: 1 });
user_schema.index({ phone: 1 });
user_schema.index({ createdAt: -1 });

export const User = mongoose.model('User', user_schema);
