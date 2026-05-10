// backend/src/models/discount.model.js
import mongoose from "mongoose";

const LocalizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, trim: true, default: "" },
    ru: { type: String, trim: true, default: "" },
    uz: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const DiscountSchema = new mongoose.Schema(
  {
    title: {
      type: LocalizedStringSchema,
      default: { en: "", ru: "", uz: "" },
    },
    description: {
      type: LocalizedStringSchema,
      default: { en: "", ru: "", uz: "" },
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
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
