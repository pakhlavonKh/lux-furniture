import axios from 'axios';
import { config } from '../../config/index';
import { PaymeCallbackRequest, PaymentStatus } from '../../types/payment.types';
import { generateSignature } from '../../utils/encryption';
import { generateTransactionId } from '../../utils/crypto';

class PaymePaymentService {
  private apiUrl: string;
  private merchantId: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = config.payments.payme.isDev
      ? config.payments.payme.devApiUrl
      : config.payments.payme.prodApiUrl;
    this.merchantId = config.payments.payme.merchantId;
    this.apiKey = config.payments.payme.apiKey;

    if (!this.merchantId || !this.apiKey) {
      console.warn('Payme payment system not configured');
    }
  }

  /**
   * Create payment and get payment URL
   */
  async createPayment(_amount: number, _orderId: string, _description: string, returnUrl: string, _phone?: string): Promise<{ transactionId: string; paymentUrl: string }> {
    try {
      const transactionId = generateTransactionId();

      // Generate request signature
      const sig = this.generateSignature(transactionId);

      const paymentUrl = `${this.apiUrl}/checkout?merchant_id=${this.merchantId}&transaction_id=${transactionId}&signature=${sig}&return_url=${encodeURIComponent(returnUrl)}`;

      return {
        transactionId,
        paymentUrl
      };
    } catch (error) {
      throw new Error(`Payme payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process callback from Payme
   */
  async processCallback(callbackData: PaymeCallbackRequest): Promise<{ status: PaymentStatus; transactionId: string }> {
    // Verify signature
    const expectedSignature = this.generateSignature(callbackData.transaction_id, String(callbackData.status));

    if (expectedSignature !== callbackData.signature) {
      throw new Error('Invalid callback signature');
    }

    let status = PaymentStatus.PENDING;
    if (callbackData.status === 1) {
      status = PaymentStatus.COMPLETED;
    } else if (callbackData.status === -1) {
      status = PaymentStatus.FAILED;
    }

    return {
      status,
      transactionId: callbackData.transaction_id
    };
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string): Promise<{ status: PaymentStatus }> {
    try {
      const sig = this.generateSignature(transactionId);

      const response = await axios.get(
        `${this.apiUrl}/status?merchant_id=${this.merchantId}&transaction_id=${transactionId}&signature=${sig}`
      );

      let status = PaymentStatus.PENDING;
      if (response.data.status === 'success' || response.data.status === '1') {
        status = PaymentStatus.COMPLETED;
      } else if (response.data.status === 'failed' || response.data.status === '0') {
        status = PaymentStatus.FAILED;
      }

      return { status };
    } catch (error) {
      throw new Error(`Failed to get payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(transactionId: string): Promise<{ refundId: string; status: string }> {
    try {
      const refundId = generateTransactionId();
      const sig = this.generateSignature(transactionId, 'refund');

      const response = await axios.post(`${this.apiUrl}/refund`, {
        merchant_id: this.merchantId,
        transaction_id: transactionId,
        refund_id: refundId,
        signature: sig
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Refund failed');
      }

      return { 
        refundId,
        status: 'completed'
      };
    } catch (error) {
      throw new Error(`Payme refund failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate HMAC-SHA256 signature
   */
  private generateSignature(transactionId: string, _action: string = 'pay'): string {
    const message = `${this.merchantId}${transactionId}`;
    return generateSignature(message, this.apiKey);
  }
}

export default new PaymePaymentService();
