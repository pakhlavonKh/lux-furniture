// backend/src/models/news.model.js
import mongoose from "mongoose";

const LocalizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, required: [true, "English text is required"], trim: true },
    ru: { type: String, required: [true, "Russian text is required"], trim: true },
    uz: { type: String, required: [true, "Uzbek text is required"], trim: true },
  },
  { _id: false }
);

const LocalizedStringOptionalSchema = new mongoose.Schema(
  {
    en: { type: String, trim: true, default: "" },
    ru: { type: String, trim: true, default: "" },
    uz: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: LocalizedStringSchema,
      required: [true, "Title is required"],
    },
    description: {
      type: LocalizedStringSchema,
      required: [true, "Description is required"],
    },
    content: {
      type: LocalizedStringOptionalSchema,
    },
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
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
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

export default mongoose.model("News", NewsSchema);
