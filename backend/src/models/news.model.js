// backend/src/models/news.model.js
import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
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
    content: {
      type: String,
      trim: true,
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
