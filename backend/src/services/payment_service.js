import { Payment } from '../models/payment_model.js';
import { UzumTransaction } from '../models/uzum_transaction_model.js';
import payme_service from '../payments/templates/payme_service.js';
import click_service from '../payments/templates/click_service.js';
import uzum_service from '../payments/templates/uzum_service.js';
import { generate_id } from '../utils/crypto.js';

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

const PAYMENT_METHOD = {
  PAYME: 'payme',
  CLICK: 'click',
  UZUM: 'uzum',
};

class PaymentService {
  /**
   * Create payment and get payment URL
   */
  async create_payment(
    user_id,
    amount,
    order_id,
    description,
    method,
    return_url,
    phone
  ) {
    // Create payment record in database
    const payment = await Payment.create({
      user_id,
      order_id,
      amount,
      currency: 'UZS',
      method,
      status: PAYMENT_STATUS.PENDING,
    });

    if (!payment) {
      throw new Error('Failed to create payment record');
    }

    // Create payment with selected method
    let payment_data;
    switch (method) {
      case PAYMENT_METHOD.PAYME:
        payment_data = await payme_service.create_payment(
          amount,
          order_id,
          description,
          return_url,
          phone || ''
        );
        break;
      case PAYMENT_METHOD.CLICK:
        payment_data = await click_service.create_payment(
          amount,
          order_id,
          description,
          return_url
        );
        break;
      case PAYMENT_METHOD.UZUM:
        payment_data = await uzum_service.create_payment(
          amount,
          order_id,
          description,
          return_url
        );
        break;
      default:
        throw new Error(`Unknown payment method: ${method}`);
    }

    // Update payment record with transaction ID
    await Payment.findByIdAndUpdate(payment._id, {
      transaction_id: payment_data.transaction_id,
    });

    return payment_data;
  }

  /**
   * Handle payment callback
   */
  async handle_callback(method, callback_data) {
    let callback_result;

    switch (method) {
      case PAYMENT_METHOD.PAYME:
        callback_result = await payme_service.process_callback(callback_data);
        break;
      case PAYMENT_METHOD.CLICK:
        callback_result = await click_service.process_callback(callback_data);
        break;
      case PAYMENT_METHOD.UZUM:
        callback_result = await uzum_service.process_callback(callback_data);
        break;
      default:
        throw new Error(`Unknown payment method: ${method}`);
    }

    // Update payment status in database
    await Payment.findOneAndUpdate(
      { transaction_id: callback_result.transaction_id },
      {
        status: callback_result.status,
        completed_at: callback_result.status === PAYMENT_STATUS.COMPLETED ? new Date() : null,
      }
    );

    return callback_result;
  }

  /**
   * Check payment status
   */
  async check_payment_status(method, transaction_id) {
    let status;

    switch (method) {
      case PAYMENT_METHOD.PAYME: {
        const result = await payme_service.get_payment_status(transaction_id);
        status = result.status;
        break;
      }
      case PAYMENT_METHOD.CLICK:
        status = await click_service.check_payment_status(transaction_id);
        break;
      case PAYMENT_METHOD.UZUM:
        status = await uzum_service.check_payment_status(transaction_id);
        break;
      default:
        throw new Error(`Unknown payment method: ${method}`);
    }

    // Update payment status in database
    await Payment.findOneAndUpdate(
      { transaction_id },
      {
        status,
        completed_at: status === PAYMENT_STATUS.COMPLETED ? new Date() : null,
      }
    );

    return status;
  }

  /**
   * Get payment by ID
   */
  async get_payment_by_id(payment_id) {
    const payment = await Payment.findById(payment_id);

    if (!payment) {
      return null;
    }

    return this.map_to_payment(payment);
  }

  /**
   * Get payment by transaction ID
   */
  async get_payment_by_transaction_id(transaction_id) {
    const payment = await Payment.findOne({ transaction_id });

    if (!payment) {
      return null;
    }

    return this.map_to_payment(payment);
  }

  /**
   * Get user payments
   */
  async get_user_payments(user_id) {
    const payments = await Payment.find({ user_id }).sort({ createdAt: -1 });

    return payments.map((payment) => this.map_to_payment(payment));
  }

  /**
   * Refund payment
   */
  async refund_payment(payment_id) {
    const payment = await this.get_payment_by_id(payment_id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== PAYMENT_STATUS.COMPLETED) {
      throw new Error('Only completed payments can be refunded');
    }

    if (!payment.transaction_id) {
      throw new Error('Transaction ID not found');
    }

    let refund_data;
    switch (payment.method) {
      case PAYMENT_METHOD.PAYME:
        refund_data = await payme_service.refund_payment(payment.transaction_id);
        break;
      case PAYMENT_METHOD.CLICK:
        throw new Error('CLICK refund not yet implemented');
      case PAYMENT_METHOD.UZUM:
        // For UZUM, initiate reverse webhook (handled by UZUM Bank)
        refund_data = { refund_id: payment.transaction_id, status: 'initiated' };
        break;
      default:
        throw new Error(`Unknown payment method: ${payment.method}`);
    }

    // Update payment status
    await Payment.findByIdAndUpdate(payment_id, {
      status: PAYMENT_STATUS.REFUNDED,
    });

    return refund_data;
  }

  map_to_payment(data) {
    return {
      id: data._id?.toString() || data.id,
      user_id: data.user_id,
      order_id: data.order_id,
      amount: data.amount,
      currency: data.currency || 'UZS',
      method: data.method,
      status: data.status,
      transaction_id: data.transaction_id,
      metadata: data.metadata,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
      completed_at: data.completed_at,
    };
  }
}

export default new PaymentService();
