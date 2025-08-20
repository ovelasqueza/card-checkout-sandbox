export interface PaymentRequest {
  amount: number;
  currency: string;
  customerEmail: string;
  reference: string;
  description: string;
}

export interface PaymentResponse {
  id: string;
  status: 'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR';
  reference: string;
  amount: number;
  currency: string;
  createdAt: Date;
  message?: string;
}

export interface PaymentServicePort {
  processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse>;
  getPaymentStatus(paymentId: string): Promise<PaymentResponse>;
}