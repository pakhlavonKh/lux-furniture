// backend/src/scripts/seed_admin.js

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import { connectDB, disconnectDB } from "../config/mongodb_connection.js";
import User from "../models/user_model.js";

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to get user input
const getUserInput = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
};

// Helper function to get password input (hidden)
const getPasswordInput = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

const seedAdmin = async () => {
  try {
    console.log("\n🌱 Creating Admin Account...\n");

    await connectDB();
    console.log("✅ Connected to MongoDB\n");

    // Get email from user
    let email = await getUserInput("Enter admin email: ");
    email = email.trim();

    if (!email || !email.includes("@")) {
      throw new Error("Invalid email format");
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log(`\n⚠️  Admin account already exists: ${email}`);
      rl.close();
      await disconnectDB();
      return;
    }

    // Get password from user
    const password = await getPasswordInput("Enter admin password (min 6 characters): ");

    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Get name from user
    const name = await getUserInput("Enter admin name: ");

    if (!name) {
      throw new Error("Name is required");
    }

    // Create admin user
    const admin = new User({
      email,
      password,
      name: name.trim(),
      is_admin: true,
      role: "admin",
    });

    await admin.save();

    console.log("\n✅ Admin account created successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name.trim()}`);
    console.log("\n💡 You can now login with these credentials!\n");

    rl.close();
    await disconnectDB();
    console.log("✅ Database disconnected\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message, "\n");
    rl.close();
    process.exit(1);
  }
};

seedAdmin();
