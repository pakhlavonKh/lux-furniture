import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const user_schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, sparse: true },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    is_email_verified: { type: Boolean, default: false },
    is_phone_verified: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
    last_login_at: { type: Date },
  },
  { timestamps: true, collection: 'users' }
);

// Create indexes for performance
user_schema.index({ email: 1 });
user_schema.index({ phone: 1 });
user_schema.index({ createdAt: -1 });

// Hash password before saving
user_schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
user_schema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', user_schema);
export default User;
