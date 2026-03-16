// backend/src/scripts/seed_content.js
import News from "../models/news.model.js";
import Discount from "../models/discount.model.js";
import { connectDB, disconnectDB } from "../config/mongodb_connection.js";

const seedContent = async () => {
  try {
    await connectDB();

    // Clear existing data
    await News.deleteMany({});
    await Discount.deleteMany({});

    // ===========================
    // SEED NEWS
    // ===========================
    const newsItems = [
      {
        title: "New Spring Collection Launched",
        description: "Introducing our stunning spring collection featuring modern minimalist designs and sustainable materials.",
        content:
          "We're thrilled to announce the launch of our spring collection! This season brings fresh designs, eco-friendly materials, and innovative solutions for modern living. Explore pieces that combine elegance with sustainability.",
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/v1/spring-collection.jpg",
          public_id: "spring-collection",
          alt: "Spring Collection Overview",
        },
        isActive: true,
        order: 1,
      },
      {
        title: "Interior Design Workshop Series",
        description: "Join our expert designers for exclusive workshops on creating your dream interior space.",
        content:
          "This March, we're hosting a series of interactive workshops covering everything from space planning to color theory. Our expert team will guide you through creating beautiful, functional spaces. Register now for limited seats!",
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/v1/workshop.jpg",
          public_id: "workshop",
          alt: "Interior Design Workshop",
        },
        isActive: true,
        order: 2,
      },
      {
        title: "Sustainable Craftsmanship at Heart",
        description: "Learn about our commitment to sustainable furniture craftsmanship and ethical sourcing.",
        content:
          "Every piece in our collection is crafted with passion and responsibility. We work with artisans who share our commitment to quality and environmental consciousness. Discover the stories behind our most beloved creations.",
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/v1/craftsmanship.jpg",
          public_id: "craftsmanship",
          alt: "Artisan Craftsmanship",
        },
        isActive: true,
        order: 3,
      },
      {
        title: "Customer Spotlight: Modern Minimalist Home",
        description: "See how Sarah transformed her space using our contemporary furniture collection.",
        content:
          "Meet Sarah, who created a stunning minimalist home using pieces from our contemporary collection. her journey from cramped apartment to open, airy living space is truly inspiring. Read her full transformation story on our blog.",
        image: {
          url: "https://res.cloudinary.com/demo/image/upload/v1/customer-showcase.jpg",
          public_id: "customer-showcase",
          alt: "Customer Home Showcase",
        },
        isActive: true,
        order: 4,
      },
      {
        title: "Premium Materials: What Makes the Difference",
        description: "Explore the premium materials that set our furniture apart and ensure longevity.",
        content:
          "Quality materials are the foundation of exceptional furniture. In this article, we break down the materials we use and why they matter. From Italian leather to sustainably harvested teak, each choice is deliberate and thoughtful.",
        isActive: true,
        order: 5,
      },
    ];

    const createdNews = await News.insertMany(newsItems);
    console.log(`✅ Seeded ${createdNews.length} news items`);

    // ===========================
    // SEED DISCOUNTS
    // ===========================
    const discounts = [
      {
        title: "Spring Sale - 20% Off",
        description: "Celebrate the season with 20% off selected spring collection items. Limited time offer!",
        percentage: 20,
        productIds: ["1", "2", "3", "4", "5"],
        code: "SPRING20",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        order: 1,
      },
      {
        title: "Bundle Deal - Save 25%",
        description: "Buy a sofa and coffee table together and save 25% on your entire purchase.",
        percentage: 25,
        productIds: ["1", "6", "7"],
        code: "BUNDLE25",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        order: 2,
      },
      {
        title: "First-Time Customer Offer",
        description: "New to Manaku? Get 15% off your first order with code WELCOME15.",
        percentage: 15,
        productIds: [], // Applies to all products
        code: "WELCOME15",
        isActive: true,
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        order: 3,
      },
      {
        title: "Clearance Event - Up to 40% Off",
        description: "Final sale on previous season items. Stock is limited, shop now!",
        percentage: 40,
        productIds: ["8", "9", "10"],
        code: "CLEARANCE",
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        order: 4,
      },
      {
        title: "Loyalty Member Exclusive",
        description: "VIP members get 30% off on all luxury collection items.",
        percentage: 30,
        productIds: ["11", "12", "13", "14", "15"],
        code: "VIP30",
        isActive: true,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
        order: 5,
      },
      {
        title: "Student & Professional Discount",
        description: "Show your ID and get 12% off all items. No code needed in-store.",
        percentage: 12,
        productIds: [],
        code: "STUDENT12",
        isActive: true,
        startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // Always available
        order: 6,
      },
    ];

    const createdDiscounts = await Discount.insertMany(discounts);
    console.log(`✅ Seeded ${createdDiscounts.length} discounts`);

    console.log("\n📊 Content Seeding Complete!");
    console.log(`   News Items: ${createdNews.length}`);
    console.log(`   Discounts: ${createdDiscounts.length}`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    await disconnectDB();
    process.exit(1);
  }
};

seedContent();
