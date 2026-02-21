import express from 'express';
import { login, register, logout } from '../controllers/auth_controller.js';
import { authenticate_token } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.post('/logout', authenticate_token, logout);

export default router;
