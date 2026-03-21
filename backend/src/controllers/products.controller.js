// backend/src/controllers/products.controller.js
import Product from "../models/product.model.js";

/* ===========================
   GET ALL PRODUCTS
=========================== */
export const getAllProducts = async (req, res) => {
  try {
    const { category, collection, active, featured, search } = req.query;
    const filter = {};

    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;
    if (featured === "true") filter.isFeatured = true;
    if (category) filter.category = category;
    if (collection) filter.collections = collection;
    if (search) {
      filter.$or = [
        { "name.en": { $regex: search, $options: "i" } },
        { "name.ru": { $regex: search, $options: "i" } },
        { "name.uz": { $regex: search, $options: "i" } },
        { "description.en": { $regex: search, $options: "i" } },
        { "description.ru": { $regex: search, $options: "i" } },
        { "description.uz": { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

/* ===========================
   GET SINGLE PRODUCT
=========================== */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

/* ===========================
   CREATE PRODUCT
=========================== */
export const createProduct = async (req, res) => {
  try {
    const {
      name, slug, description, shortDescription,
      category, subcategory, collections,
      basePrice, vatPercent,
      availability,
      images, variants,
      materials, dimensions, weight, shippingClass,
      productionTimeDays, warrantyMonths,
      assemblyAvailable, assemblyPrice, assemblyTimeDays,
      customizable,
      seo,
      isFeatured, isActive,
    } = req.body;

    if (!name?.en || !name?.ru || !name?.uz) {
      return res.status(400).json({
        success: false,
        message: "Name is required in all 3 languages (en, ru, uz)",
      });
    }

    if (!slug || !category || basePrice === undefined || !images || !variants) {
      return res.status(400).json({
        success: false,
        message: "Slug, category, basePrice, images, and variants are required",
      });
    }

    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A product with this slug already exists",
      });
    }

    const product = await Product.create({
      name, slug, description, shortDescription,
      category, subcategory, collections: collections || [],
      basePrice, vatPercent,
      availability,
      images, variants,
      materials, dimensions, weight, shippingClass,
      productionTimeDays, warrantyMonths,
      assemblyAvailable, assemblyPrice, assemblyTimeDays,
      customizable,
      seo,
      isFeatured, isActive,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

/* ===========================
   UPDATE PRODUCT
=========================== */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If slug is being changed, check uniqueness
    if (updates.slug) {
      const existing = await Product.findOne({
        slug: updates.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "A product with this slug already exists",
        });
      }
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

/* ===========================
   DELETE PRODUCT
=========================== */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

/* ===========================
   UPDATE VARIANT STOCK
=========================== */
export const updateVariantStock = async (req, res) => {
  try {
    const { id, sku } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid stock value is required",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variants.find((v) => v.sku === sku);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    variant.stock = stock;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating stock",
      error: error.message,
    });
  }
};
