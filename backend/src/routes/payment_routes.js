import { Router } from 'express';
import { body } from 'express-validator';
import * as payment_controller from '../controllers/payment_controller.js';
import { authenticate_token } from '../middleware/auth.js';
import { handle_validation_errors } from '../middleware/validation.js';

const router = Router();

// Create payment (authenticated)
router.post(
  '/create',
  authenticate_token,
  [
    body('amount').isFloat({ min: 0.01 }),
    body('order_id').trim().notEmpty(),
    body('method').isIn(['payme', 'click', 'uzum']),
    body('return_url').isURL(),
    body('description').optional().trim(),
    body('phone').optional().trim(),
  ],
  handle_validation_errors,
  payment_controller.create_payment
);

// Check payment status (authenticated)
router.get('/status', authenticate_token, payment_controller.get_payment_status);

// Get user payments (authenticated)
router.get('/list', authenticate_token, payment_controller.get_user_payments);

// Refund payment (authenticated)
router.post(
  '/refund',
  authenticate_token,
  [body('payment_id').trim().notEmpty()],
  handle_validation_errors,
  payment_controller.refund_payment
);

// Payment callbacks (NOT authenticated - these are from payment providers)
router.post('/payme/callback', payment_controller.payme_callback);
router.post('/click/callback', payment_controller.click_callback);

// UZUM Merchant API Webhook Endpoints (NOT authenticated - these are from UZUM Bank)
// Follows UZUM Merchant API protocol with HTTP Basic Auth verification
router.post('/uzum/check', payment_controller.uzum_check_webhook);
router.post('/uzum/create', payment_controller.uzum_create_webhook);
router.post('/uzum/confirm', payment_controller.uzum_confirm_webhook);
router.post('/uzum/reverse', payment_controller.uzum_reverse_webhook);
router.post('/uzum/status', payment_controller.uzum_status_webhook);

// Legacy UZUM callback endpoint
router.post('/uzum/callback', payment_controller.uzum_callback);

export default router;
