import { Router } from 'express';
import { body } from 'express-validator';
import * as paymentController from '../controllers/payment.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { handleValidationErrors } from '../middleware/validation.middleware.js';

const router = Router();

// Create payment (authenticated)
router.post(
  '/create',
  authenticateToken,
  [
    body('amount').isFloat({ min: 0.01 }),
    body('orderId').trim().notEmpty(),
    body('method').isIn(['payme', 'click', 'uzum']),
    body('returnUrl').isURL(),
    body('description').optional().trim(),
    body('phone').optional().trim()
  ],
  handleValidationErrors,
  paymentController.createPayment
);

// Check payment status (authenticated)
router.get('/status', authenticateToken, paymentController.getPaymentStatus);

// Get user payments (authenticated)
router.get('/list', authenticateToken, paymentController.getUserPayments);

// Refund payment (authenticated)
router.post('/refund', authenticateToken, [body('paymentId').trim().notEmpty()], handleValidationErrors, paymentController.refundPayment);

// Payment callbacks (NOT authenticated - these are from payment providers)
router.post('/payme/callback', paymentController.paymeCallback);
router.post('/click/callback', paymentController.clickCallback);
router.post('/uzum/callback', paymentController.uzumCallback);

export default router;
