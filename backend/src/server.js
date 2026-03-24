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
import collectionRoutes from "./routes/collection.routes.js";
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
      crossOriginResourcePolicy: false, // Disable helmet's CORP header globally; we set it per-route
    })
  );
} else {
  app.use(
    helmet({
      crossOriginResourcePolicy: false, // Disable helmet's CORP header globally; we set it per-route
    })
  );
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
      // Allow all localhost ports in development
      if (
        NODE_ENV !== "production" &&
        typeof origin === "string" &&
        /^http:\/\/(localhost|127\.0\.0\.1):\d+$/i.test(origin)
      ) {
        return callback(null, true);
      }
      if (
        !origin ||
        allowedOrigins.some((allowed) =>
          allowed instanceof RegExp
            ? allowed.test(origin)
            : allowed === origin
        )
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
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
   STATIC FILES (UPLOADS) - CORS FOR IMAGES
============================== */

// Middleware to add image-specific CORS & cross-origin headers
// These headers are REQUIRED for <img> tags to load images from cross-origin sources
app.use("/uploads", (req, res, next) => {
  // CORS Header: Allow the requesting origin to access the resource
  // This header tells the browser "yes, you (the frontend) can use this image"
  // Required for XMLHttpRequest/fetch; <img> tags also check this
  res.set("Access-Control-Allow-Origin", "*");

  // Cross-Origin-Resource-Policy Header: Explicitly allow cross-origin resource access
  // This is the KEY header for <img> tag cross-origin loading (modern browsers)
  // Values: "cross-origin" (allow all), "same-site" (same site only), "same-origin" (same origin only)
  res.set("Cross-Origin-Resource-Policy", "cross-origin");

  // CORS Preflight: Handle OPTIONS requests from browsers
  // Browsers send OPTIONS before GET on cross-origin requests
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Accept, Range");
    res.set("Access-Control-Max-Age", "86400"); // Cache preflight for 24h
    return res.sendStatus(200);
  }

  next();
});

// Serve static files with proper caching
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"), {
    maxAge: "7d", // Browser caches images for 7 days
    etag: false, // Disable ETag for better caching with maxAge
    lastModified: false,
    setHeaders: (res, filePath) => {
      // Set proper Content-Type based on file extension
      const ext = filePath.split(".").pop();
      const contentTypes = {
        webp: "image/webp",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        svg: "image/svg+xml",
      };
      const mimeType = contentTypes[ext?.toLowerCase()] || "application/octet-stream";
      res.set("Content-Type", mimeType);
    },
  })
);

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
app.use("/api/collections", collectionRoutes);
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