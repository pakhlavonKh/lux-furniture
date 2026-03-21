import mongoose from "mongoose";
import { connectDB } from "../config/mongodb_connection.js";
import Product from "../models/product.model.js";
import { readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function mapImagesToProducts() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("✓ MongoDB Atlas connected successfully\n");

    // Get all image files from uploads folder
    const uploadsPath = join(__dirname, "../../uploads");
    const imageFiles = readdirSync(uploadsPath).filter(file => 
      /\.(jpg|jpeg|png|gif|webp|jfif)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} image files:`);
    imageFiles.forEach((file, idx) => console.log(`  ${idx + 1}. ${file}`));

    // Get all products
    const products = await Product.find().sort({ _id: 1 });
    console.log(`\nFound ${products.length} products\n`);

    // Map images to products
    let updateCount = 0;
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      // Cycle through available images
      const imageFile = imageFiles[i % imageFiles.length];
      
      // Update product with actual image file
      product.images = [
        {
          url: `/uploads/${imageFile}`,
          public_id: `lux-furniture/${product.slug}-0`,
          isPrimary: true,
          alt: product.name?.en || `${product.slug} image`,
        }
      ];

      await product.save();
      updateCount++;
      
      if ((i + 1) % 20 === 0) {
        console.log(`✓ Updated ${i + 1}/${products.length} products...`);
      }
    }

    console.log(`\n✅ Successfully mapped images to all ${updateCount} products`);
    console.log(`   Images are distributed across ${imageFiles.length} available files`);
    
    // Show some examples
    console.log("\nExample mappings:");
    const examples = await Product.find().limit(3).select("slug images");
    examples.forEach(p => {
      console.log(`  ${p.slug}: ${p.images[0]?.url}`);
    });

    await mongoose.connection.close();
    console.log("\n✓ MongoDB connection closed");
  } catch (error) {
    console.error("\n✗ Mapping failed:", error.message);
    process.exit(1);
  }
}

mapImagesToProducts();
