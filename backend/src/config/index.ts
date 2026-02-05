import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_URL: process.env.API_URL || 'http://localhost:5000',

  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  FRONTEND_URL_PROD: process.env.FRONTEND_URL_PROD || 'https://lux-furniture.com',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Payment Systems
  payments: {
    payme: {
      merchantId: process.env.PAYME_MERCHANT_ID || '',
      apiKey: process.env.PAYME_API_KEY || '',
      secretKey: process.env.PAYME_SECRET_KEY || '',
      callbackUrl: process.env.PAYME_CALLBACK_URL || '',
      isDev: process.env.NODE_ENV !== 'production',
      devApiUrl: 'https://sandbox-api.payme.uz',
      prodApiUrl: 'https://api.payme.uz'
    },
    click: {
      merchantId: process.env.CLICK_MERCHANT_ID || '',
      serviceId: process.env.CLICK_SERVICE_ID || '',
      apiKey: process.env.CLICK_API_KEY || '',
      secretKey: process.env.CLICK_SECRET_KEY || '',
      callbackUrl: process.env.CLICK_CALLBACK_URL || '',
      isDev: process.env.NODE_ENV !== 'production',
      devApiUrl: 'https://sandbox.click.uz',
      prodApiUrl: 'https://api.click.uz'
    },
    uzum: {
      merchantId: process.env.UZUM_MERCHANT_ID || '',
      apiKey: process.env.UZUM_API_KEY || '',
      secretKey: process.env.UZUM_SECRET_KEY || '',
      callbackUrl: process.env.UZUM_CALLBACK_URL || '',
      isDev: process.env.NODE_ENV !== 'production',
      devApiUrl: 'https://sandbox-api.uzumbank.uz',
      prodApiUrl: 'https://api.uzumbank.uz'
    }
  },

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug'
};

export default config;
