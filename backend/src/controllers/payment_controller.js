import payment_service from '../services/payment_service.js';
import uzum_service from '../payments/templates/uzum_service.js';
import payme_service from '../payments/templates/payme_service.js';
import { PAYMENT_METHOD } from '../models/payment_model.js';

export const create_payment = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { amount, order_id, description, method, return_url, phone } = req.body;

    if (!user_id) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    if (!amount || !order_id || !method || !return_url) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, order_id, method, return_url',
      });
      return;
    }

    if (!Object.values(PAYMENT_METHOD).includes(method)) {
      res.status(400).json({
        success: false,
        message: `Invalid payment method. Allowed: ${Object.values(PAYMENT_METHOD).join(', ')}`,
      });
      return;
    }

    const payment_data = await payment_service.create_payment(
      user_id,
      amount,
      order_id,
      description || 'Lux Furniture Purchase',
      method,
      return_url,
      phone
    );

    res.json({
      success: true,
      message: 'Payment created successfully',
      data: payment_data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create payment';
    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const get_payment_status = async (req, res) => {
  try {
    const { transaction_id, method } = req.query;

    if (!transaction_id || !method) {
      res.status(400).json({
        success: false,
        message: 'Transaction ID and method are required',
      });
      return;
    }

    if (!Object.values(PAYMENT_METHOD).includes(method)) {
      res.status(400).json({
        success: false,
        message: `Invalid payment method. Allowed: ${Object.values(PAYMENT_METHOD).join(', ')}`,
      });
      return;
    }

    const status = await payment_service.check_payment_status(method, transaction_id);

    res.json({
      success: true,
      data: {
        transaction_id,
        status,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to check payment status';
    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const get_user_payments = async (req, res) => {
  try {
    const user_id = req.user_id;

    if (!user_id) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const payments = await payment_service.get_user_payments(user_id);

    res.json({
      success: true,
      data: payments,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get payments';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const refund_payment = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { payment_id } = req.body;

    if (!user_id) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    if (!payment_id) {
      res.status(400).json({
        success: false,
        message: 'Payment ID is required',
      });
      return;
    }

    const payment = await payment_service.get_payment_by_id(payment_id);
    if (!payment || payment.user_id !== user_id) {
      res.status(403).json({
        success: false,
        message: 'Payment not found or unauthorized',
      });
      return;
    }

    const refund_data = await payment_service.refund_payment(payment_id);

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: refund_data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to refund payment';
    res.status(400).json({
      success: false,
      message,
    });
  }
};

// Payment callbacks (these should NOT be authenticated)
export const payme_callback = async (req, res) => {
  try {
    const callback_data = req.body;

    // Payme uses JSON-RPC 2.0 for all communication
    // This endpoint should handle RPC-style requests
    await payment_service.handle_callback('payme', callback_data);

    res.json({
      success: true,
      message: 'Callback processed',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Callback processing failed';
    console.error('Payme callback error:', message);

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const click_callback = async (req, res) => {
  try {
    const callback_data = req.body;

    await payment_service.handle_callback('click', callback_data);

    res.json({
      success: true,
      message: 'Callback processed',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Callback processing failed';
    console.error('CLICK callback error:', message);

    res.status(400).json({
      success: false,
      message,
    });
  }
};

// UZUM Webhook Handlers - Follow UZUM Merchant API protocol
export const uzum_check_webhook = async (req, res) => {
  try {
    // Verify Basic Auth
    const auth_header = req.headers.authorization || '';
    if (!uzum_service.verify_basic_auth(auth_header)) {
      res.status(401).json({
        service_id: req.body.service_id,
        status: 'ERROR',
        data: { error: 'Invalid authentication' },
      });
      return;
    }

    const result = await uzum_service.handle_check_webhook(req.body);

    res.status(200).json({
      service_id: req.body.service_id,
      timestamp: Date.now(),
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Check webhook failed';
    console.error('UZUM check webhook error:', message);

    res.status(200).json({
      service_id: req.body.service_id,
      status: 'ERROR',
      data: { error: message },
    });
  }
};

export const uzum_create_webhook = async (req, res) => {
  try {
    // Verify Basic Auth
    const auth_header = req.headers.authorization || '';
    if (!uzum_service.verify_basic_auth(auth_header)) {
      res.status(401).json({
        service_id: req.body.service_id,
        trans_id: req.body.trans_id,
        status: 'ERROR',
      });
      return;
    }

    const result = await uzum_service.handle_create_webhook(req.body);

    res.status(200).json({
      service_id: req.body.service_id,
      timestamp: Date.now(),
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Create webhook failed';
    console.error('UZUM create webhook error:', message);

    res.status(200).json({
      service_id: req.body.service_id,
      trans_id: req.body.trans_id,
      status: 'ERROR',
    });
  }
};

export const uzum_confirm_webhook = async (req, res) => {
  try {
    // Verify Basic Auth
    const auth_header = req.headers.authorization || '';
    if (!uzum_service.verify_basic_auth(auth_header)) {
      res.status(401).json({
        service_id: req.body.service_id,
        trans_id: req.body.trans_id,
        status: 'ERROR',
      });
      return;
    }

    const result = await uzum_service.handle_confirm_webhook(req.body);

    res.status(200).json({
      service_id: req.body.service_id,
      timestamp: Date.now(),
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Confirm webhook failed';
    console.error('UZUM confirm webhook error:', message);

    res.status(200).json({
      service_id: req.body.service_id,
      trans_id: req.body.trans_id,
      status: 'ERROR',
    });
  }
};

export const uzum_reverse_webhook = async (req, res) => {
  try {
    // Verify Basic Auth
    const auth_header = req.headers.authorization || '';
    if (!uzum_service.verify_basic_auth(auth_header)) {
      res.status(401).json({
        service_id: req.body.service_id,
        trans_id: req.body.trans_id,
        status: 'ERROR',
      });
      return;
    }

    const result = await uzum_service.handle_reverse_webhook(req.body);

    res.status(200).json({
      service_id: req.body.service_id,
      timestamp: Date.now(),
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Reverse webhook failed';
    console.error('UZUM reverse webhook error:', message);

    res.status(200).json({
      service_id: req.body.service_id,
      trans_id: req.body.trans_id,
      status: 'ERROR',
    });
  }
};

export const uzum_status_webhook = async (req, res) => {
  try {
    // Verify Basic Auth
    const auth_header = req.headers.authorization || '';
    if (!uzum_service.verify_basic_auth(auth_header)) {
      res.status(401).json({
        service_id: req.body.service_id,
        trans_id: req.body.trans_id,
        status: 'ERROR',
      });
      return;
    }

    const result = await uzum_service.handle_status_webhook(req.body);

    res.status(200).json({
      service_id: req.body.service_id,
      timestamp: Date.now(),
      ...result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Status webhook failed';
    console.error('UZUM status webhook error:', message);

    res.status(200).json({
      service_id: req.body.service_id,
      trans_id: req.body.trans_id,
      status: 'ERROR',
    });
  }
};

export const uzum_callback = async (req, res) => {
  try {
    const callback_data = req.body;

    await payment_service.handle_callback('uzum', callback_data);

    res.json({
      success: true,
      message: 'Callback processed',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Callback processing failed';
    console.error('UZUM callback error:', message);

    res.status(400).json({
      success: false,
      message,
    });
  }
};
