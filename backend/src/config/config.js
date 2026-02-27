import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Гарантированная загрузка backend/.env
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env");
}

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5002", 10),

  API_URL: process.env.API_URL || "http://localhost:5002",

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  FRONTEND_URL_PROD:
    process.env.FRONTEND_URL_PROD || "https://lux-furniture.com",

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  MONGO_URI: process.env.MONGO_URI,

  payments: {
    payme: {
      merchantId: process.env.PAYME_MERCHANT_ID || "",
      secretKey: process.env.PAYME_SECRET_KEY || "",
      callbackUrl: process.env.PAYME_CALLBACK_URL || "",
    },
    click: {
      merchantId: process.env.CLICK_MERCHANT_ID || "",
      secretKey: process.env.CLICK_SECRET_KEY || "",
      callbackUrl: process.env.CLICK_CALLBACK_URL || "",
    },
    uzum: {
      merchantId: process.env.UZUM_MERCHANT_ID || "",
      secretKey: process.env.UZUM_SECRET_KEY || "",
      apiKey: process.env.UZUM_API_KEY || "",
      callbackUrl: process.env.UZUM_CALLBACK_URL || "",
    },
  },
};