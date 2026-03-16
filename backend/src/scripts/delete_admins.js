// backend/src/scripts/delete_admins.js

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

const deleteAdmins = async () => {
  try {
    console.log("\n⚠️  WARNING: This will delete ALL admin accounts!\n");

    await connectDB();
    console.log("✅ Connected to MongoDB\n");

    // Find all admins
    const admins = await User.find({ is_admin: true });

    if (admins.length === 0) {
      console.log("ℹ️  No admin accounts found.\n");
      rl.close();
      await disconnectDB();
      return;
    }

    console.log(`Found ${admins.length} admin account(s):\n`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} (${admin.name})`);
    });
    console.log();

    // Ask for confirmation
    const confirm = await getUserInput("Are you sure you want to delete all admin accounts? (yes/no): ");

    if (confirm !== "yes") {
      console.log("\n❌ Cancelled.\n");
      rl.close();
      await disconnectDB();
      return;
    }

    // Delete all admins
    const result = await User.deleteMany({ is_admin: true });

    console.log(`\n✅ Deleted ${result.deletedCount} admin account(s)!\n`);

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

deleteAdmins();
