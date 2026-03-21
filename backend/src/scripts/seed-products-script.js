import mongoose from "mongoose";
import { connectDB } from "../config/mongodb_connection.js";
import Product from "../models/product.model.js";
import { productsData } from "../data/seed-products.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load locale files for product name translations
const localesPath = join(__dirname, "../../../src/locales");
let locales = {};
try {
  locales.en = JSON.parse(readFileSync(join(localesPath, "en.json"), "utf-8"));
  locales.ru = JSON.parse(readFileSync(join(localesPath, "ru.json"), "utf-8"));
  locales.uz = JSON.parse(readFileSync(join(localesPath, "uz.json"), "utf-8"));
  console.log("✓ Locale files loaded for product translations");
} catch (err) {
  console.warn("⚠ Could not load locale files:", err.message);
  locales = { en: {}, ru: {}, uz: {} };
}

// Helper to extract translated name from locale using nameKey path
function getProductName(catalogProduct, locale) {
  if (!catalogProduct.nameKey) {
    return `Product ${catalogProduct.id}`;
  }
  
  // Parse nameKey like "products.catalog.items.1.name"
  const keyPath = catalogProduct.nameKey.split(".");
  let value = locales[locale];
  
  for (const key of keyPath) {
    if (value && typeof value === "object") {
      value = value[key];
    } else {
      return `Product ${catalogProduct.id}`; // Fallback
    }
  }
  
  return value && typeof value === "string" ? value : `Product ${catalogProduct.id}`;
}

// Transform catalogData format to MongoDB schema format
function transformProduct(catalogProduct) {
  return {
    // Use actual product names from locale files instead of placeholders
    name: {
      en: getProductName(catalogProduct, "en"),
      ru: getProductName(catalogProduct, "ru"),
      uz: getProductName(catalogProduct, "uz"),
    },
    slug: catalogProduct.slug,
    category: catalogProduct.categoryId, // Use categoryId as category
    subcategory: catalogProduct.subcategoryId,
    basePrice: catalogProduct.basePrice * 1000, // Convert from displayed format to cents
    vatPercent: catalogProduct.vatPercent || 12,
    isActive: true,
    isFeatured: false,
    
    // Map product images using image names from catalogData
    // Images are copied from frontend assets to backend uploads
    images: catalogProduct.images.map((imageName, idx) => {
      // Try to find matching image in uploads folder
      // Image names like "Art2_0001" map to actual files in uploads
      // For now, use a generic mapping - actual files will serve them
      const imageExtensions = ['.webp', '.jpg', '.png', '.jpeg', '.gif'];
      let foundImage = imageName;
      
      for (const ext of imageExtensions) {
        // Check if file might exist with these extensions
        foundImage = imageName + ext;
        break; // Use webp as primary, backend will serve whatever exists
      }
      
      return {
        url: `/uploads/${foundImage}`,
        public_id: `lux-furniture/${catalogProduct.slug}-${idx}`,
        isPrimary: idx === 0,
        alt: imageName,
      };
    }),
    
    // Add default variant if none exists
    variants: catalogProduct.variants && catalogProduct.variants.length > 0
      ? catalogProduct.variants.map(v => ({
          sku: v.id || `${catalogProduct.slug}-${Math.random().toString(36).substr(2, 9)}`,
          color: v.color,
          price: v.price || catalogProduct.basePrice * 1000,
          stock: 10, // Default stock
          isActive: true,
        }))
      : [{
          sku: `${catalogProduct.slug}-001`,
          price: catalogProduct.basePrice * 1000,
          stock: 10,
          isActive: true,
        }],
  };
}

async function seedProducts() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("✓ MongoDB Atlas connected successfully");

    // Clear existing products
    console.log("\nClearing existing products...");
    const deleteResult = await Product.deleteMany({});
    console.log(`✓ Deleted ${deleteResult.deletedCount} existing products`);

    console.log(`\nTransforming and seeding ${productsData.length} products...`);

    // Transform all products to match MongoDB schema
    const transformedProducts = productsData.map(transformProduct);

    // Insert products
    try {
      const result = await Product.insertMany(transformedProducts, { ordered: false });
      console.log(`✓ Successfully created ${result.length} products`);
    } catch (insertError) {
      console.log(`✓ Partial insert - ${insertError.result?.nInserted || 0} products created`);
      if (insertError.writeErrors?.length > 0) {
        console.log(`⚠ ${insertError.writeErrors.length} products failed validation`);
      }
    }

    // Close connection
    await mongoose.connection.close();
    console.log("✓ MongoDB connection closed");
  } catch (error) {
    console.error("\n✗ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedProducts();
