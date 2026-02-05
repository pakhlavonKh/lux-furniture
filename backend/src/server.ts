import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import paymentRoutes from './routes/payment.routes';
import healthRoutes from './routes/health.routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Load environment variables
dotenv.config();

// Server configuration

const app: Express = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.FRONTEND_URL_PROD || 'https://lux-furniture.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(morgan('combined'));
app.use(requestLogger);

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          Lux Furniture Backend - Server Started             ║
╠════════════════════════════════════════════════════════════╣
║  Environment: ${NODE_ENV.padEnd(43)}║
║  Port: ${String(PORT).padEnd(51)}║
║  URL: http://localhost:${String(PORT).padEnd(38)}║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
