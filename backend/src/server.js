import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import database
import { connectDB, disconnectDB } from './config/mongodb_connection.js';

// Import routes
import auth_routes from './routes/auth_routes.js';
import payment_routes from './routes/payment_routes.js';
// import health_routes from './routes/health_routes.js';

// Import middleware
import { error_handler } from './middleware/error_handler.js';
import { request_logger } from './middleware/request_logger.js';

// Load environment variables
dotenv.config();

// Server configuration
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:', 'wss:'],
      frameSrc: ["'self'", 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));
app.use(compression({
  level: 6,
  threshold: 1024,
}));

// CORS configuration - Enhanced for macOS, iOS, and Safari
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.FRONTEND_URL_PROD || 'https://lux-furniture.com',
  'http://localhost:8080', // Development on port 8080
  'http://127.0.0.1:8080',
  'http://localhost:5173', // Vite default
  /https:\/\/.*\.lux-furniture\.com/i, // Allow subdomains
];

const cors_options = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => 
      allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Number',
    'X-Page-Size',
    'Content-Length',
  ],
  maxAge: 86400, // 24 hours
};

app.use(cors(cors_options));

// Add custom headers for mobile & Safari compatibility
app.use((req, res, next) => {
  // Add headers for iOS Safari compatibility
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Cache control for API endpoints
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  
  // Support for iOS app bridge
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(morgan('combined'));
app.use(request_logger);

// API Routes
// app.use('/api/health', health_routes);
app.use('/api/auth', auth_routes);
app.use('/api/payments', payment_routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware (must be last)
app.use(error_handler);

// Start server
const start_server = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║          Lux Furniture Backend - Server Started             ║
╠════════════════════════════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(43)}║
║  Port: ${String(PORT).padEnd(51)}║
║  URL: http://localhost:${String(PORT).padEnd(38)}║
║  Database: MongoDB Atlas                                   ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(async () => {
        await disconnectDB();
        console.log('HTTP server and MongoDB closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      server.close(async () => {
        await disconnectDB();
        console.log('HTTP server and MongoDB closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start_server();

export default app;
