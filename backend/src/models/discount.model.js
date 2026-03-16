// backend/src/models/discount.model.js
import mongoose from "mongoose";

const DiscountSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    percentage: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: [0, "Percentage cannot be less than 0"],
      max: [100, "Percentage cannot exceed 100"],
    },
    productIds: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      url: {
        type: String,
        required: false,
      },
      public_id: {
        type: String,
        required: false,
      },
      alt: {
        type: String,
        trim: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: false,
    },
    code: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Discount", DiscountSchema);
