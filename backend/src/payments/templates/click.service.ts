import axios from 'axios';
import { config } from '../../config/index';
import { PaymentStatus } from '../../types/payment.types';
import { generateMD5Hash } from '../../utils/encryption';
import { generateTransactionId } from '../../utils/crypto';

class ClickPaymentService {
  private apiUrl: string;
  private serviceId: string;
  private secretKey: string;

  constructor() {
    this.apiUrl = config.payments.click.isDev
      ? config.payments.click.devApiUrl
      : config.payments.click.prodApiUrl;
    this.serviceId = config.payments.click.serviceId;
    this.secretKey = config.payments.click.secretKey;

    if (!this.serviceId || !this.secretKey) {
      console.warn('CLICK payment system not configured');
    }
  }

  /**
   * Generate invoice
   */
  async createPayment(amount: number, _orderId: string, _description: string, returnUrl: string): Promise<{ transactionId: string; paymentUrl: string }> {
    try {
      const merchantTransId = generateTransactionId();
      const signTime = this.getSignTime();

      // Generate sign string: SERVICE_ID;CLICK_TRANS_ID;MERCHANT_TRANS_ID;AMOUNT;SIGN_TIME;SIGN_STRING
      const signString = `${this.serviceId};;${merchantTransId};${amount};${signTime};${this.secretKey}`;
      const sign = generateMD5Hash(signString);

      const paymentUrl = `${this.apiUrl}/invoice/pay/${this.serviceId}/${merchantTransId}/${amount}/?sign_time=${signTime}&sign_string=${sign}&return_url=${encodeURIComponent(returnUrl)}`;

      return {
        transactionId: merchantTransId,
        paymentUrl
      };
    } catch (error) {
      throw new Error(`CLICK payment creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process callback from CLICK
   */
  async processCallback(callbackData: any): Promise<{ status: PaymentStatus; transactionId: string }> {
    // Verify signature
    const signString = `${callbackData.click_trans_id}${this.secretKey}${callbackData.merchant_trans_id}${callbackData.amount}`;
    const expectedSign = generateMD5Hash(signString);

    if (expectedSign !== callbackData.sign_string) {
      throw new Error('Invalid callback signature');
    }

    let status = PaymentStatus.PENDING;
    if (callbackData.error === 0) {
      status = PaymentStatus.COMPLETED;
    } else {
      status = PaymentStatus.FAILED;
    }

    return {
      status,
      transactionId: callbackData.merchant_trans_id
    };
  }

  /**
   * Verify payment
   */
  async verifyPayment(clickTransId: string, merchantTransId: string, amount: number): Promise<{ signString: string }> {
    const signString = `${clickTransId}${this.secretKey}${merchantTransId}${amount}`;
    const sign = generateMD5Hash(signString);

    return { signString: sign };
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(clickTransId: string): Promise<PaymentStatus> {
    try {
      const signTime = this.getSignTime();
      const signString = `${this.serviceId};${clickTransId};;${signTime};${this.secretKey}`;
      const sign = generateMD5Hash(signString);

      const response = await axios.get(`${this.apiUrl}/api/invoice-status/`, {
        params: {
          service_id: this.serviceId,
          click_trans_id: clickTransId,
          sign_time: signTime,
          sign_string: sign
        }
      });

      if (response.data.error === 0) {
        return PaymentStatus.COMPLETED;
      }

      return PaymentStatus.FAILED;
    } catch (error) {
      throw new Error(`CLICK status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getSignTime(): string {
    return new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
  }
}

export default new ClickPaymentService();
