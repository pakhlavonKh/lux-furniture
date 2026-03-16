// backend/src/scripts/check_admin.js

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
      resolve(answer.trim().toLowerCase());
    });
  });
};

const checkAdmin = async () => {
  try {
    console.log("\n🔍 Checking Admin Accounts...\n");

    await connectDB();
    console.log("✅ Connected to MongoDB\n");

    // Get email from user
    let email = await getUserInput("Enter admin email to check (or 'all' for all users): ");

    let users;
    if (email === "all") {
      users = await User.find({});
      console.log(`\n📋 All users in database (${users.length} total):\n`);
    } else {
      users = await User.find({ email: email });
      if (users.length === 0) {
        console.log(`\n❌ No user found with email: ${email}\n`);
        rl.close();
        await disconnectDB();
        return;
      }
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   is_admin: ${user.is_admin}`);
      console.log(`   role: ${user.role}`);
      console.log(`   _id: ${user._id}`);
      console.log();
    });

    rl.close();
    await disconnectDB();
    console.log("✅ Database disconnected\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message, "\n");
    rl.close();
    await disconnectDB();
    process.exit(1);
  }
};

checkAdmin();
