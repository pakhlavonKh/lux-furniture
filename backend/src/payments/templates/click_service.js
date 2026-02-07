import axios from 'axios';
import { config } from '../../config/config.js';
import { PAYMENT_STATUS } from '../../models/payment_model.js';
import { generate_md5_hash } from '../../utils/encryption.js';
import { generate_transaction_id } from '../../utils/crypto.js';

class ClickPaymentService {
  constructor() {
    this.api_url = config.payments.click.is_dev
      ? config.payments.click.dev_api_url
      : config.payments.click.prod_api_url;
    this.service_id = config.payments.click.service_id;
    this.secret_key = config.payments.click.secret_key;

    if (!this.service_id || !this.secret_key) {
      console.warn('CLICK payment system not configured');
    }
  }

  /**
   * Generate invoice
   */
  async create_payment(amount, order_id, description, return_url) {
    try {
      const merchant_trans_id = generate_transaction_id();
      const sign_time = this.get_sign_time();

      // Generate sign string: SERVICE_ID;CLICK_TRANS_ID;MERCHANT_TRANS_ID;AMOUNT;SIGN_TIME;SIGN_STRING
      const sign_string = `${this.service_id};;${merchant_trans_id};${amount};${sign_time};${this.secret_key}`;
      const sign = generate_md5_hash(sign_string);

      const payment_url = `${this.api_url}/invoice/pay/${this.service_id}/${merchant_trans_id}/${amount}/?sign_time=${sign_time}&sign_string=${sign}&return_url=${encodeURIComponent(return_url)}`;

      return {
        transaction_id: merchant_trans_id,
        payment_url,
      };
    } catch (error) {
      throw new Error(
        `CLICK payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Process callback from CLICK
   */
  async process_callback(callback_data) {
    // Verify signature
    const sign_string = `${callback_data.click_trans_id}${this.secret_key}${callback_data.merchant_trans_id}${callback_data.amount}`;
    const expected_sign = generate_md5_hash(sign_string);

    if (expected_sign !== callback_data.sign_string) {
      throw new Error('Invalid callback signature');
    }

    let status = PAYMENT_STATUS.PENDING;
    if (callback_data.error === 0) {
      status = PAYMENT_STATUS.COMPLETED;
    } else {
      status = PAYMENT_STATUS.FAILED;
    }

    return {
      status,
      transaction_id: callback_data.merchant_trans_id,
    };
  }

  /**
   * Verify payment
   */
  async verify_payment(click_trans_id, merchant_trans_id, amount) {
    const sign_string = `${click_trans_id}${this.secret_key}${merchant_trans_id}${amount}`;
    const sign = generate_md5_hash(sign_string);

    return { sign_string: sign };
  }

  /**
   * Check payment status
   */
  async check_payment_status(click_trans_id) {
    try {
      const sign_time = this.get_sign_time();
      const sign_string = `${this.service_id};${click_trans_id};;${sign_time};${this.secret_key}`;
      const sign = generate_md5_hash(sign_string);

      const response = await axios.get(`${this.api_url}/api/invoice-status/`, {
        params: {
          service_id: this.service_id,
          click_trans_id,
          sign_time,
          sign_string: sign,
        },
      });

      if (response.data.error === 0) {
        return PAYMENT_STATUS.COMPLETED;
      }

      return PAYMENT_STATUS.FAILED;
    } catch (error) {
      throw new Error(
        `CLICK status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  get_sign_time() {
    return new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
  }
}

export default new ClickPaymentService();
