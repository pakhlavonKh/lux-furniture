// user_model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      sparse: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },

    is_email_verified: {
      type: Boolean,
      default: false,
    },

    is_phone_verified: {
      type: Boolean,
      default: false,
    },

    last_login_at: Date,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

/* ===========================
   INDEXES
=========================== */

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ createdAt: -1 });

/* ===========================
   PASSWORD HASH
=========================== */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12); // усиливаем
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/* ===========================
   METHODS
=========================== */

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User ||
  mongoose.model("User", userSchema);