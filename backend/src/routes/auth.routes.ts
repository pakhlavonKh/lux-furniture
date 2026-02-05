import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { handleValidationErrors } from '../middleware/validation.middleware.js';

const router = Router();

// Signup route
router.post(
  '/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('passwordConfirm').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('phone').optional().trim()
  ],
  handleValidationErrors,
  authController.signup
);

// Login route
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  handleValidationErrors,
  authController.login
);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);

router.put(
  '/profile',
  authenticateToken,
  [body('firstName').optional().trim(), body('lastName').optional().trim(), body('phone').optional().trim()],
  handleValidationErrors,
  authController.updateProfile
);

router.post(
  '/change-password',
  authenticateToken,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 8 })],
  handleValidationErrors,
  authController.changePassword
);

export default router;
