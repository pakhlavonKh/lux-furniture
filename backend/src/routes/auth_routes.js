// auth_routes.js
import express from 'express';
import { login, register, logout } from '../controllers/auth_controller.js';
import { authenticate_token, authorize_admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.post('/logout', authenticate_token, logout);

// Admin routes
router.get('/admin/verify', authenticate_token, authorize_admin, (req, res) => {
  // This endpoint checks if user is admin
  res.status(200).json({
    success: true,
    message: 'User is admin',
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      is_admin: true,
    },
  });
});

export default router;
