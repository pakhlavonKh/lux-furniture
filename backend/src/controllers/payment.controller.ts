import { Request, Response } from 'express';
import paymentService from '../services/payment.service.js';
import { PaymentMethod } from '../types/payment.types.js';

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { amount, orderId, description, method, returnUrl, phone } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    if (!amount || !orderId || !method || !returnUrl) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: amount, orderId, method, returnUrl'
      });
      return;
    }

    if (!Object.values(PaymentMethod).includes(method)) {
      res.status(400).json({
        success: false,
        message: `Invalid payment method. Allowed: ${Object.values(PaymentMethod).join(', ')}`
      });
      return;
    }

    const paymentData = await paymentService.createPayment(
      userId,
      amount,
      orderId,
      description || 'Lux Furniture Purchase',
      method,
      returnUrl,
      phone
    );

    res.json({
      success: true,
      message: 'Payment created successfully',
      data: paymentData
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create payment';
    res.status(400).json({
      success: false,
      message
    });
  }
};

export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transactionId, method } = req.query;

    if (!transactionId || !method) {
      res.status(400).json({
        success: false,
        message: 'Transaction ID and method are required'
      });
      return;
    }

    if (!Object.values(PaymentMethod).includes(method as PaymentMethod)) {
      res.status(400).json({
        success: false,
        message: `Invalid payment method. Allowed: ${Object.values(PaymentMethod).join(', ')}`
      });
      return;
    }

    const status = await paymentService.checkPaymentStatus(
      method as PaymentMethod,
      transactionId as string
    );

    res.json({
      success: true,
      data: {
        transactionId,
        status
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to check payment status';
    res.status(400).json({
      success: false,
      message
    });
  }
};

export const getUserPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    const payments = await paymentService.getUserPayments(userId);

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get payments';
    res.status(500).json({
      success: false,
      message
    });
  }
};

export const refundPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { paymentId } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
      return;
    }

    if (!paymentId) {
      res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      });
      return;
    }

    const payment = await paymentService.getPaymentById(paymentId);
    if (!payment || payment.userId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Payment not found or unauthorized'
      });
      return;
    }

    const refundData = await paymentService.refundPayment(paymentId);

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: refundData
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to refund payment';
    res.status(400).json({
      success: false,
      message
    });
  }
};

// Payment callbacks (these should NOT be authenticated)
export const paymeCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const callbackData = req.body;

    await paymentService.handleCallback(PaymentMethod.PAYME, callbackData);

    res.json({
      success: true,
      message: 'Callback processed'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Callback processing failed';
    console.error('Payme callback error:', message);

    res.status(400).json({
      success: false,
      message
    });
  }
};

export const clickCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const callbackData = req.body;

    await paymentService.handleCallback(PaymentMethod.CLICK, callbackData);

    res.json({
      success: true,
      message: 'Callback processed'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Callback processing failed';
    console.error('CLICK callback error:', message);

    res.status(400).json({
      success: false,
      message
    });
  }
};

export const uzumCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const callbackData = req.body;

    await paymentService.handleCallback(PaymentMethod.UZUM, callbackData);

    res.json({
      success: true,
      message: 'Callback processed'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Callback processing failed';
    console.error('UZUM callback error:', message);

    res.status(400).json({
      success: false,
      message
    });
  }
};
