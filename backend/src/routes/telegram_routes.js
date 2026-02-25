import express from 'express';
import {
  getTelegramStatus,
  testTelegramConnection,
  sendTestMessage,
  submitContactForm,
} from '../controllers/telegram_controller.js';
import { authenticate_token, authorize_admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/contact', submitContactForm);

// Admin routes (protected)
router.get('/status', authenticate_token, authorize_admin, getTelegramStatus);
router.get('/test-connection', authenticate_token, authorize_admin, testTelegramConnection);
router.post('/test-message', authenticate_token, authorize_admin, sendTestMessage);

export default router;
