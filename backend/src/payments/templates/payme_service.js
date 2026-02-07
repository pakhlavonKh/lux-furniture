import axios from 'axios';
import { config } from '../../config/config.js';
import { PAYMENT_STATUS } from '../../models/payment_model.js';
import { generate_signature } from '../../utils/encryption.js';
import { generate_transaction_id } from '../../utils/crypto.js';
import { Payment } from '../../models/payment_model.js';

class PaymePaymentService {
  constructor() {
    this.rpc_url = config.payments.payme.is_dev
      ? config.payments.payme.dev_api_url
      : config.payments.payme.prod_api_url;
    this.merchant_id = config.payments.payme.merchant_id;
    this.username = config.payments.payme.username;
    this.password = config.payments.payme.password;
    this.request_id = 1;

    if (!this.merchant_id || !this.username || !this.password) {
      console.warn('Payme payment system not configured');
    }
  }

  /**
   * Make JSON-RPC 2.0 request
   */
  async rpc_call(method, params) {
    try {
      // Create Basic Auth header
      const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');

      const payload = {
        jsonrpc: '2.0',
        method,
        params: {
          ...params,
          time: Date.now(),
        },
        id: this.request_id++,
      };

      const response = await axios.post(this.rpc_url, payload, {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.error) {
        throw new Error(
          `RPC Error: ${response.data.error.message} (Code: ${response.data.error.code})`
        );
      }

      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create payment - Initiate transaction
   */
  async create_payment(amount, order_id, description, return_url, phone) {
    try {
      const transaction_id = generate_transaction_id();

      // Call CheckTransaction RPC method to verify
      const check_result = await this.rpc_call('CheckTransaction', {
        account: {
          order_id,
        },
      });

      if (!check_result.allow) {
        throw new Error('Transaction not allowed');
      }

      // Create transaction
      const create_result = await this.rpc_call('CreateTransaction', {
        amount: Math.round(amount * 100), // Amount in tiyn (smallest unit)
        account: {
          order_id,
          phone: phone || '',
        },
        description,
        return_url,
      });

      const payment_url = `${this.rpc_url}/checkout?transaction_id=${create_result.transaction}`;

      return {
        transaction_id: create_result.transaction,
        payment_url,
      };
    } catch (error) {
      throw new Error(
        `Payme payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get payment status via RPC
   */
  async get_payment_status(transaction_id) {
    try {
      const result = await this.rpc_call('GetStatement', {
        from: Date.now() - 86400000, // Last 24 hours
        till: Date.now(),
        transactions: transaction_id,
      });

      if (!result.transactions || result.transactions.length === 0) {
        return { status: PAYMENT_STATUS.FAILED };
      }

      const transaction = result.transactions[0];

      // Payme states: 1 = pending, 2 = completed, -1 = failed, -2 = canceled
      let status = PAYMENT_STATUS.PENDING;
      if (transaction.state === 2) {
        status = PAYMENT_STATUS.COMPLETED;
      } else if (transaction.state === -1 || transaction.state === -2) {
        status = PAYMENT_STATUS.FAILED;
      }

      return { status };
    } catch (error) {
      throw new Error(
        `Failed to get payment status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Process callback from Payme (PerformTransaction RPC)
   */
  async process_callback(callback_data) {
    try {
      const { transaction_id, amount, account } = callback_data;

      // Verify credentials in callback body
      if (!callback_data.username || !callback_data.password) {
        throw new Error('Missing authentication in callback');
      }

      const expected_hash = generate_signature(
        `${transaction_id}${callback_data.account}${amount}`,
        this.password
      );

      if (expected_hash !== callback_data.signature) {
        throw new Error('Invalid callback signature');
      }

      let status = PAYMENT_STATUS.PENDING;
      if (callback_data.perform === 1) {
        status = PAYMENT_STATUS.COMPLETED;

        // Perform transaction in merchant system
        await this.rpc_call('PerformTransaction', {
          transaction_id,
          amount,
          account,
        });
      } else if (callback_data.perform === -1) {
        status = PAYMENT_STATUS.FAILED;
      }

      return {
        status,
        transaction_id,
      };
    } catch (error) {
      throw new Error(
        `Callback processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Cancel transaction via RPC
   */
  async cancel_transaction(transaction_id) {
    try {
      await this.rpc_call('CancelTransaction', {
        transaction: transaction_id,
      });
    } catch (error) {
      throw new Error(
        `Failed to cancel transaction: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Refund payment via RPC
   */
  async refund_payment(transaction_id) {
    try {
      const refund_id = generate_transaction_id();

      // Cancel the transaction to initiate refund
      await this.cancel_transaction(transaction_id);

      return {
        refund_id,
        status: 'completed',
      };
    } catch (error) {
      throw new Error(
        `Payme refund failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

export default new PaymePaymentService();
