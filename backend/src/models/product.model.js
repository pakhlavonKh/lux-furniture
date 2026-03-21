// backend/src/models/product.model.js
import mongoose from "mongoose";

/* ===========================
   LOCALIZED STRING SCHEMAS
=========================== */

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

/* ===========================
   IMAGE SCHEMA
=========================== */

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

/* ===========================
   VARIANT SCHEMA
=========================== */

const VariantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      trim: true,
    },

    size: {
      type: String,
      trim: true,
    },

    material: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { _id: false }
);

/* ===========================
   MAIN PRODUCT SCHEMA
=========================== */

const ProductSchema = new mongoose.Schema(
  {
    /* Basic */
    name: {
      type: LocalizedStringSchema,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: LocalizedStringOptionalSchema,
    },

    shortDescription: {
      type: LocalizedStringOptionalSchema,
    },

    /* Classification */
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    subcategory: {
      type: String,
      trim: true,
      index: true,
    },

    collections: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],

    /* Pricing */
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    vatPercent: {
      type: Number,
      default: 12,
      min: 0,
    },

    /* Inventory */
    totalStock: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },

    availability: {
      type: String,
      enum: ["in_stock", "preorder", "made_to_order"],
      default: "in_stock",
      index: true,
    },

    /* Media */
    images: {
      type: [ImageSchema],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one image is required",
      },
    },

    /* Variants */
    variants: {
      type: [VariantSchema],
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one variant is required",
      },
    },

    /* Physical Properties */
    materials: {
      frame: String,
      upholstery: String,
      legs: String,
    },

    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
    },

    weight: {
      type: Number,
      min: 0,
    },

    shippingClass: String,

    /* Production */
    productionTimeDays: {
      type: Number,
      min: 0,
    },

    warrantyMonths: {
      type: Number,
      min: 0,
    },

    /* Assembly */
    assemblyAvailable: {
      type: Boolean,
      default: false,
    },

    assemblyPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    assemblyTimeDays: {
      type: Number,
      min: 0,
    },

    /* Customization */
    customizable: {
      type: Boolean,
      default: false,
    },

    /* SEO */
    seo: {
      title: LocalizedStringOptionalSchema,
      description: LocalizedStringOptionalSchema,
    },

    /* Analytics */
    viewsCount: {
      type: Number,
      default: 0,
    },

    salesCount: {
      type: Number,
      default: 0,
    },

    /* Control */
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

/* ===========================
   INDEXES
=========================== */

ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ availability: 1, isActive: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ createdAt: -1 });

/* ===========================
   PRE-SAVE LOGIC
=========================== */

// Auto-calc totalStock from variants
ProductSchema.pre("save", function (next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce(
      (acc, variant) => acc + (variant.stock || 0),
      0
    );
  } else {
    this.totalStock = 0;
  }

  next();
});

/* ===========================
   METHODS
=========================== */

// Check if product purchasable
ProductSchema.methods.isPurchasable = function () {
  return this.isActive && this.totalStock > 0;
};

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);