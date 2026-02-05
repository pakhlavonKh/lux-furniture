import { getSupabase } from '../config/supabase';
import { Payment, PaymentStatus, PaymentMethod } from '../types/payment.types';
import paymeService from '../payments/templates/payme.service';
import clickService from '../payments/templates/click.service';
import uzumService from '../payments/templates/uzum.service';
import { generateId } from '../utils/crypto';

class PaymentService {
  private supabase = getSupabase();

  /**
   * Create payment and get payment URL
   */
  async createPayment(
    userId: string,
    amount: number,
    orderId: string,
    description: string,
    method: PaymentMethod,
    returnUrl: string,
    phone?: string
  ): Promise<{ transactionId: string; paymentUrl: string }> {
    // Create payment record in database
    const paymentId = generateId();

    const { error: dbError } = await this.supabase.from('payments').insert([
      {
        id: paymentId,
        user_id: userId,
        order_id: orderId,
        amount,
        currency: 'UZS',
        method,
        status: PaymentStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    if (dbError) {
      throw new Error(`Failed to create payment record: ${dbError.message}`);
    }

    // Create payment with selected method
    let paymentData;
    switch (method) {
      case PaymentMethod.PAYME:
        paymentData = await paymeService.createPayment(amount, orderId, description, returnUrl, phone || '');
        break;
      case PaymentMethod.CLICK:
        paymentData = await clickService.createPayment(amount, orderId, description, returnUrl);
        break;
      case PaymentMethod.UZUM:
        paymentData = await uzumService.createPayment(amount, orderId, description, returnUrl);
        break;
      default:
        throw new Error(`Unknown payment method: ${method}`);
    }

    // Update payment record with transaction ID
    await this.supabase
      .from('payments')
      .update({
        transaction_id: paymentData.transactionId,
        updated_at: new Date()
      })
      .eq('id', paymentId);

    return paymentData;
  }

  /**
   * Handle payment callback
   */
  async handleCallback(method: PaymentMethod, callbackData: any): Promise<{ status: PaymentStatus; transactionId: string }> {
    let callbackResult;

    switch (method) {
      case PaymentMethod.PAYME:
        callbackResult = await paymeService.processCallback(callbackData);
        break;
      case PaymentMethod.CLICK:
        callbackResult = await clickService.processCallback(callbackData);
        break;
      case PaymentMethod.UZUM:
        callbackResult = await uzumService.processCallback(callbackData);
        break;
      default:
        throw new Error(`Unknown payment method: ${method}`);
    }

    // Update payment status in database
    await this.supabase
      .from('payments')
      .update({
        status: callbackResult.status,
        updated_at: new Date(),
        completed_at: callbackResult.status === PaymentStatus.COMPLETED ? new Date() : null
      })
      .eq('transaction_id', callbackResult.transactionId);

    return callbackResult;
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(method: PaymentMethod, transactionId: string): Promise<PaymentStatus> {
    let status: PaymentStatus;

    switch (method) {
      case PaymentMethod.PAYME: {
        const result = await paymeService.getPaymentStatus(transactionId);
        status = result.status;
        break;
      }
      case PaymentMethod.CLICK:
        status = await clickService.checkPaymentStatus(transactionId);
        break;
      case PaymentMethod.UZUM:
        status = await uzumService.checkPaymentStatus(transactionId);
        break;
      default:
        throw new Error(`Unknown payment method: ${method}`);
    }

    // Update payment status in database
    await this.supabase
      .from('payments')
      .update({
        status,
        updated_at: new Date(),
        completed_at: status === PaymentStatus.COMPLETED ? new Date() : null
      })
      .eq('transaction_id', transactionId);

    return status;
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment | null> {
    const { data: payment, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error || !payment) {
      return null;
    }

    return this.mapToPayment(payment);
  }

  /**
   * Get payment by transaction ID
   */
  async getPaymentByTransactionId(transactionId: string): Promise<Payment | null> {
    const { data: payment, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (error || !payment) {
      return null;
    }

    return this.mapToPayment(payment);
  }

  /**
   * Get user payments
   */
  async getUserPayments(userId: string): Promise<Payment[]> {
    const { data: payments, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (payments || []).map((payment) => this.mapToPayment(payment));
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentId: string): Promise<{ refundId: string; status: string }> {
    const payment = await this.getPaymentById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new Error('Only completed payments can be refunded');
    }

    if (!payment.transactionId) {
      throw new Error('Transaction ID not found');
    }

    let refundData;
    switch (payment.method) {
      case PaymentMethod.PAYME:
        refundData = await paymeService.refundPayment(payment.transactionId);
        break;
      case PaymentMethod.CLICK:
        throw new Error('CLICK refund not yet implemented');
      case PaymentMethod.UZUM:
        refundData = await uzumService.refundPayment(payment.transactionId, payment.amount);
        break;
      default:
        throw new Error(`Unknown payment method: ${payment.method}`);
    }

    // Update payment status
    await this.supabase
      .from('payments')
      .update({
        status: PaymentStatus.REFUNDED,
        updated_at: new Date()
      })
      .eq('id', paymentId);

    return refundData;
  }

  private mapToPayment(data: any): Payment {
    return {
      id: data.id,
      userId: data.user_id,
      orderId: data.order_id,
      amount: data.amount,
      currency: data.currency,
      method: data.method as PaymentMethod,
      status: data.status as PaymentStatus,
      transactionId: data.transaction_id,
      metadata: data.metadata,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined
    };
  }
}

export default new PaymentService();
