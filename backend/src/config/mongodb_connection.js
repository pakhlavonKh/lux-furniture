import mongoose from 'mongoose';
import { config } from './config.js';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    const uri = config.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(uri, {
      dbName: config.MONGODB_DB_NAME,
      retryWrites: true,
      w: 'majority',
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('✓ MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection failed:', error.message);
    process.exit(1);
  }
};

export default mongoose;
