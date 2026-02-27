import Product from "../models/product.model.js";
import { connectDB } from "../config/mongodb_connection.js";

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});

    const products = [
      {
        name: "Aria Premium Sofa",
        slug: "aria-premium-sofa",
        description: "Luxury modern sofa with premium upholstery.",
        shortDescription: "Premium 3-seat sofa",

        category: "living-room",
        collections: ["modern", "premium"],

        basePrice: 8500000,
        vatPercent: 12,

        images: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            public_id: "demo-image",
            alt: "Aria Sofa",
            isPrimary: true,
          },
        ],

        variants: [
          {
            sku: "ARIA-GREY",
            color: "Grey",
            size: "3-seat",
            material: "Fabric",
            price: 8500000,
            stock: 5,
          },
          {
            sku: "ARIA-BEIGE",
            color: "Beige",
            size: "3-seat",
            material: "Fabric",
            price: 8700000,
            stock: 3,
          },
        ],

        materials: {
          frame: "Solid wood",
          upholstery: "Premium fabric",
          legs: "Metal",
        },

        dimensions: {
          width: 220,
          height: 85,
          depth: 95,
        },

        weight: 60,
        productionTimeDays: 14,
        warrantyMonths: 24,

        assemblyAvailable: true,
        assemblyPrice: 250000,
        assemblyTimeDays: 1,

        customizable: true,
        isFeatured: true,
        isActive: true,
      },
    ];
    products.forEach(p => {
        p.totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
    });
    await Product.insertMany(products);

    console.log("✅ Products seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedProducts();