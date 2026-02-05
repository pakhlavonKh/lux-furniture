import axios from 'axios';
import { config } from '../../config/index';
import { UzumPaymentRequest, UzumCallbackRequest, PaymentStatus } from '../../types/payment.types';
import { generateSHA256Hash } from '../../utils/encryption';
import { generateTransactionId } from '../../utils/crypto';

class UzumPaymentService {
  private apiUrl: string;
  private merchantId: string;
  private apiKey: string;
  private secretKey: string;

  constructor() {
    this.apiUrl = config.payments.uzum.isDev
      ? config.payments.uzum.devApiUrl
      : config.payments.uzum.prodApiUrl;
    this.merchantId = config.payments.uzum.merchantId;
    this.apiKey = config.payments.uzum.apiKey;
    this.secretKey = config.payments.uzum.secretKey;

    if (!this.merchantId || !this.apiKey || !this.secretKey) {
      console.warn('UZUM payment system not configured');
    }
  }

  /**
   * Create payment
   */
  async createPayment(
    amount: number,
    orderId: string,
    description: string,
    returnUrl: string
  ): Promise<{ transactionId: string; paymentUrl: string }> {
    try {
      const merchantTransId = generateTransactionId();

      const payload: UzumPaymentRequest = {
        merchant_id: this.merchantId,
        amount: amount * 100, // Convert to smallest unit
        merchant_trans_id: merchantTransId,
        service_id: orderId,
        callback_url: config.payments.uzum.callbackUrl,
        return_url: returnUrl,
        description
      };

      // Generate signature
      const signatureString = `${payload.merchant_id}${payload.amount}${payload.merchant_trans_id}${this.secretKey}`;
      const signature = generateSHA256Hash(signatureString);

      const response = await axios.post(`${this.apiUrl}/api/merchant/pay`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Signature': signature,
          'Content-Type': 'application/json'
        }
      });

      return {
        transactionId: merchantTransId,
        paymentUrl: response.data.data.payment_url
      };
    } catch (error) {
      throw new Error(`UZUM payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process callback from UZUM
   */
  async processCallback(callbackData: UzumCallbackRequest): Promise<{ status: PaymentStatus; transactionId: string }> {
    // Verify signature
    const signatureString = `${callbackData.transaction_id}${callbackData.amount}${callbackData.merchant_id}${this.secretKey}`;
    const expectedSignature = generateSHA256Hash(signatureString);

    if (expectedSignature !== callbackData.signature) {
      throw new Error('Invalid callback signature');
    }

    let status = PaymentStatus.PENDING;
    if (callbackData.status === 'SUCCESS') {
      status = PaymentStatus.COMPLETED;
    } else if (callbackData.status === 'FAILED') {
      status = PaymentStatus.FAILED;
    }

    return {
      status,
      transactionId: callbackData.merchant_transaction_id
    };
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const signatureString = `${this.merchantId}${transactionId}${this.secretKey}`;
      const signature = generateSHA256Hash(signatureString);

      const response = await axios.get(`${this.apiUrl}/api/merchant/check-status`, {
        params: {
          merchant_id: this.merchantId,
          merchant_trans_id: transactionId
        },
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Signature': signature
        }
      });

      const status = response.data.data.status;
      if (status === 'SUCCESS') return PaymentStatus.COMPLETED;
      if (status === 'FAILED') return PaymentStatus.FAILED;
      if (status === 'PENDING') return PaymentStatus.PENDING;

      return PaymentStatus.PROCESSING;
    } catch (error) {
      throw new Error(`UZUM status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(transactionId: string, amount: number): Promise<{ refundId: string; status: string }> {
    try {
      const refundId = generateTransactionId();
      const signatureString = `${this.merchantId}${transactionId}${amount}${refundId}${this.secretKey}`;
      const signature = generateSHA256Hash(signatureString);

      const response = await axios.post(
        `${this.apiUrl}/api/merchant/refund`,
        {
          merchant_id: this.merchantId,
          merchant_trans_id: transactionId,
          amount: amount * 100,
          refund_id: refundId
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'X-Signature': signature
          }
        }
      );

      return {
        refundId,
        status: response.data.data.status
      };
    } catch (error) {
      throw new Error(`UZUM refund failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new UzumPaymentService();
