export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  PAYME = 'payme',
  CLICK = 'click',
  UZUM = 'uzum'
}

export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  amount: number; // in UZS
  currency: string; // UZS
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface PaymentRequest {
  amount: number;
  orderId: string;
  description: string;
  returnUrl: string;
  method: PaymentMethod;
}

export interface PaymentCallback {
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  timestamp: Date;
}

// Payme Payment Interface
export interface PaymePaymentRequest {
  merchant_id: string;
  service_id: string;
  amount: number;
  transaction_id: string;
  return_url: string;
  description: string;
  user_id: string;
  phone: string;
}

export interface PaymeCallbackRequest {
  transaction_id: string;
  merchant_transaction_id: string;
  amount: number;
  status: number; // 1 = completed, -1 = failed
  timestamp: number;
  signature: string;
}

// CLICK Payment Interface
export interface ClickPaymentRequest {
  service_id: string;
  click_trans_id: string;
  merchant_trans_id: string;
  amount: number;
  action: number; // 0 = prepare, 1 = complete
  error: number;
  error_note: string;
  sign_time: string;
  sign_string: string;
}

export interface ClickSignRequest {
  click_trans_id: string;
  service_id: string;
  click_paydoc_id: string;
  merchant_trans_id: string;
  amount: number;
  action: number;
  error: number;
  error_note: string;
  sign_time: string;
  sign_string: string;
}

// UZUM Payment Interface
export interface UzumPaymentRequest {
  merchant_id: string;
  amount: number;
  merchant_trans_id: string;
  service_id: string;
  callback_url: string;
  return_url: string;
  description: string;
}

export interface UzumCallbackRequest {
  transaction_id: string;
  merchant_transaction_id: string;
  merchant_id: string;
  amount: number;
  status: string; // 'SUCCESS', 'FAILED', 'PENDING'
  timestamp: number;
  signature: string;
}
