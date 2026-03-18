// backend/src/server.js

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

/* ==============================
   DEPENDENCIES
============================== */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

/* ==============================
   ROUTES & MODULES
============================== */

import { connectDB, disconnectDB } from "./config/mongodb_connection.js";

import usersRoutes from "./routes/users.routes.js";
import auth_routes from "./routes/auth_routes.js";
import payment_routes from "./routes/payment_routes.js";
import telegram_routes from "./routes/telegram_routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import newsRoutes from "./routes/news.routes.js";
import discountsRoutes from "./routes/discounts.routes.js";
import productsRoutes from "./routes/products.routes.js";

import { error_handler } from "./middleware/error_handler.js";
import { request_logger } from "./middleware/request_logger.js";

/* ==============================
   SERVER CONFIG
============================== */

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

/* ==============================
   TRUST PROXY (production)
============================== */

app.set("trust proxy", 1);

/* ==============================
   SECURITY
============================== */

if (NODE_ENV === "production") {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'", "https:", "wss:"],
        },
      },
    })
  );
} else {
  app.use(helmet());
}

app.use(compression());

/* ==============================
   RATE LIMIT (ANTI BOT / DDOS)
============================== */

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: NODE_ENV === "production" ? 200 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

/* ==============================
   CORS
============================== */

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:8080",
  process.env.FRONTEND_URL_PROD || "https://lux-furniture.com",
  /https:\/\/.*\.lux-furniture\.com/i,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.some((allowed) =>
          allowed instanceof RegExp
            ? allowed.test(origin)
            : allowed === origin
        )
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* ==============================
   CORE MIDDLEWARE
============================== */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));
app.use(request_logger);

/* ==============================
   ROUTES
============================== */

app.use("/api/auth", auth_routes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payments", payment_routes);
app.use("/api/upload", uploadRoutes);
app.use("/api/telegram", telegram_routes);
app.use("/api/orders", ordersRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/discounts", discountsRoutes);
app.use("/api/products", productsRoutes);

/* ==============================
   HEALTH CHECK
============================== */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* ==============================
   404
============================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* ==============================
   ERROR HANDLER
============================== */

app.use(error_handler);

/* ==============================
   SERVER START
============================== */

const start_server = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`
  Server Started            
  Environment: ${NODE_ENV.padEnd(43)}
  Port: ${String(PORT).padEnd(51)}
  URL: http://localhost:${String(PORT).padEnd(38)}
  Database: MongoDB Atlas                                   
      `);
    });

    /* ==============================
       GRACEFUL SHUTDOWN
    ============================== */

    const shutdown = async () => {
      console.log("Shutting down server...");

      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start_server();

export default app;