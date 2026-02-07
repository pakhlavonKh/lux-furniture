import axios from 'axios';
import { config } from '../../config/config.js';
import { PAYMENT_STATUS } from '../../models/payment_model.js';
import { generate_sha256_hash } from '../../utils/encryption.js';
import { generate_transaction_id } from '../../utils/crypto.js';
import { UzumTransaction } from '../../models/uzum_transaction_model.js';
import { Payment } from '../../models/payment_model.js';

class UzumPaymentService {
  constructor() {
    this.api_url = config.payments.uzum.is_dev
      ? config.payments.uzum.dev_api_url
      : config.payments.uzum.prod_api_url;
    this.merchant_id = config.payments.uzum.merchant_id;
    this.username = config.payments.uzum.username;
    this.password = config.payments.uzum.password;
    this.secret_key = config.payments.uzum.secret_key;

    if (!this.merchant_id || !this.username || !this.password || !this.secret_key) {
      console.warn('UZUM payment system not configured');
    }
  }

  /**
   * Verify Basic Auth header
   */
  verify_basic_auth(auth_header) {
    if (!auth_header || !auth_header.startsWith('Basic ')) {
      return false;
    }

    const credentials = auth_header.substring(6);
    const decoded = Buffer.from(credentials, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    return username === this.username && password === this.password;
  }

  /**
   * Handle /check webhook - Verify payment possibility
   */
  async handle_check_webhook(data) {
    try {
      const { service_id, timestamp, params } = data;

      // Validate request structure
      if (!service_id || !timestamp || !params) {
        throw new Error('Missing required fields');
      }

      // Check if account exists in merchant system
      // For now, we'll accept any account - in production, validate against your order system
      return {
        status: 'OK',
        data: {
          account: params.account,
          fio: 'Customer',
          amount: 0,
        },
      };
    } catch (error) {
      throw new Error(
        `Check webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Handle /create webhook - Create payment transaction
   */
  async handle_create_webhook(data) {
    try {
      const { service_id, timestamp, trans_id, params, amount } = data;

      if (!service_id || !timestamp || !trans_id || !params || !amount) {
        throw new Error('Missing required fields');
      }

      const trans_time = Date.now();

      // Create transaction record
      await UzumTransaction.create({
        transaction_id: trans_id,
        service_id,
        account: params.account,
        amount: amount / 100, // Convert from smallest unit
        status: 'CREATED',
        trans_time: new Date(trans_time),
      });

      return {
        status: 'CREATED',
        trans_id,
        trans_time,
        data: {
          account: params.account,
          fio: params.client_name || 'Customer',
        },
      };
    } catch (error) {
      throw new Error(
        `Create webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Handle /confirm webhook - Confirm payment transaction
   */
  async handle_confirm_webhook(data) {
    try {
      const { service_id, timestamp, trans_id, payment_source, phone } = data;

      if (!service_id || !timestamp || !trans_id) {
        throw new Error('Missing required fields');
      }

      const confirm_time = Date.now();

      // Update transaction status to CONFIRMED
      await UzumTransaction.findOneAndUpdate(
        { transaction_id: trans_id },
        {
          status: 'CONFIRMED',
          confirm_time: new Date(confirm_time),
          payment_source,
          phone,
        }
      );

      // Update corresponding payment record
      await Payment.findOneAndUpdate(
        { transaction_id: trans_id },
        {
          status: PAYMENT_STATUS.COMPLETED,
          completed_at: new Date(),
        }
      );

      return {
        status: 'CONFIRMED',
        trans_id,
        confirm_time,
        data: {
          payment_source,
          confirmation_date: new Date(confirm_time).toISOString(),
        },
      };
    } catch (error) {
      throw new Error(
        `Confirm webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Handle /reverse webhook - Cancel payment transaction
   */
  async handle_reverse_webhook(data) {
    try {
      const { service_id, timestamp, trans_id } = data;

      if (!service_id || !timestamp || !trans_id) {
        throw new Error('Missing required fields');
      }

      const reverse_time = Date.now();

      // Update transaction status to REVERSED
      await UzumTransaction.findOneAndUpdate(
        { transaction_id: trans_id },
        {
          status: 'REVERSED',
          reverse_time: new Date(reverse_time),
        }
      );

      // Update corresponding payment record
      await Payment.findOneAndUpdate(
        { transaction_id: trans_id },
        {
          status: PAYMENT_STATUS.FAILED,
        }
      );

      return {
        status: 'REVERSED',
        trans_id,
        reverse_time,
      };
    } catch (error) {
      throw new Error(
        `Reverse webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Handle /status webhook - Check transaction status
   */
  async handle_status_webhook(data) {
    try {
      const { service_id, timestamp, trans_id } = data;

      if (!service_id || !timestamp || !trans_id) {
        throw new Error('Missing required fields');
      }

      // Query transaction status
      const transaction = await UzumTransaction.findOne({ transaction_id: trans_id });

      if (!transaction) {
        return {
          status: 'FAILED',
          trans_id,
        };
      }

      return {
        status: transaction.status,
        trans_id,
        trans_time: transaction.trans_time ? new Date(transaction.trans_time).getTime() : undefined,
        confirm_time: transaction.confirm_time
          ? new Date(transaction.confirm_time).getTime()
          : undefined,
        reverse_time: transaction.reverse_time
          ? new Date(transaction.reverse_time).getTime()
          : undefined,
      };
    } catch (error) {
      throw new Error(
        `Status webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Initiate payment (for creating initial payment request)
   */
  async create_payment(amount, order_id, description, return_url) {
    try {
      const merchant_trans_id = generate_transaction_id();

      // For UZUM, construct the payment initiation URL
      // The actual payment flow is webhook-based, but we still need to provide a URL for initial redirect
      const payment_url = `${this.api_url}/merchant/pay?merchant_id=${this.merchant_id}&merchant_trans_id=${merchant_trans_id}&amount=${amount}&service_id=${order_id}&return_url=${encodeURIComponent(return_url)}`;

      // Create payment record
      await UzumTransaction.create({
        transaction_id: merchant_trans_id,
        service_id: order_id,
        amount: amount / 100,
        status: 'PENDING',
      });

      return {
        transaction_id: merchant_trans_id,
        payment_url,
      };
    } catch (error) {
      throw new Error(
        `UZUM payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check payment status (for status queries)
   */
  async check_payment_status(transaction_id) {
    try {
      const transaction = await UzumTransaction.findOne({ transaction_id });

      if (!transaction) {
        return PAYMENT_STATUS.FAILED;
      }

      const status = transaction.status;
      if (status === 'CONFIRMED') return PAYMENT_STATUS.COMPLETED;
      if (status === 'REVERSED') return PAYMENT_STATUS.FAILED;
      if (status === 'FAILED') return PAYMENT_STATUS.FAILED;

      return PAYMENT_STATUS.PENDING;
    } catch (error) {
      throw new Error(
        `UZUM status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

export default new UzumPaymentService();
