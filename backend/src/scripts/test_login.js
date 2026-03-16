// backend/src/scripts/test_login.js
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getUserInput = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
};

const testLogin = async () => {
  try {
    console.log("\n🧪 Testing Login Flow...\n");

    await connectDB();
    console.log("✅ Connected to MongoDB\n");

    const email = await getUserInput("Enter email to test: ");
    const password = await getUserInput("Enter password: ");

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select("+password");

    if (!user) {
      console.log("\n❌ User not found\n");
      rl.close();
      await disconnectDB();
      return;
    }

    console.log("\n📋 User Record:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   is_admin (from DB): ${user.is_admin}`);
    console.log(`   role (from DB): ${user.role}`);
    console.log(`   _id: ${user._id}\n`);

    // Check password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      console.log("❌ Invalid password\n");
      rl.close();
      await disconnectDB();
      return;
    }

    console.log("✅ Password valid\n");

    // Simulate what login response would return
    const responseData = {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone || null,
      address: user.address || null,
      is_admin: user.is_admin || user.role === "admin",
    };

    console.log("📤 What Frontend Will Receive:");
    console.log(JSON.stringify(responseData, null, 2));
    console.log();

    if (responseData.is_admin) {
      console.log("✅ Frontend will redirect to: /admin\n");
    } else {
      console.log("⚠️  Frontend will redirect to: /account\n");
    }

    rl.close();
    await disconnectDB();
    console.log("✅ Database disconnected\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message, "\n");
    rl.close();
    process.exit(1);
  }
};

testLogin();
