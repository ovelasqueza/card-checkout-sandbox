import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PaymentServicePort, PaymentRequest, PaymentResponse } from '../../domain/ports/payment.service.port';

@Injectable()
export class PayflowService implements PaymentServicePort {
  private readonly httpClient: AxiosInstance;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env.PAYFLOW_API_KEY || 'test_api_key_placeholder';
    this.baseUrl = process.env.PAYFLOW_BASE_URL || 'https://sandbox.payflow.co/v1';
    
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulación del servicio de Payflow ya que no tenemos API key real
      if (this.apiKey === 'test_api_key_placeholder') {
        return this.simulatePayment(paymentRequest);
      }

      const payflowPayload = {
        amount_in_cents: Math.round(paymentRequest.amount * 100),
        currency: paymentRequest.currency,
        customer_email: paymentRequest.customerEmail,
        reference: paymentRequest.reference,
        payment_method: {
          type: 'CARD',
          installments: 1
        },
        redirect_url: process.env.PAYFLOW_REDIRECT_URL || 'http://localhost:3000/payment/callback'
      };

      const response = await this.httpClient.post('/transactions', payflowPayload);
      
      return {
        id: response.data.data.id,
        status: this.mapPayflowStatus(response.data.data.status),
        reference: response.data.data.reference,
        amount: response.data.data.amount_in_cents / 100,
        currency: response.data.data.currency,
        createdAt: new Date(response.data.data.created_at),
        message: response.data.data.status_message
      };
    } catch (error) {
      console.error('Error processing payment with Payflow:', error);
      return {
        id: `error_${Date.now()}`,
        status: 'ERROR',
        reference: paymentRequest.reference,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        createdAt: new Date(),
        message: error.message || 'Payment processing failed'
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      if (this.apiKey === 'test_api_key_placeholder') {
        return this.simulatePaymentStatus(paymentId);
      }

      const response = await this.httpClient.get(`/transactions/${paymentId}`);
      
      return {
        id: response.data.data.id,
        status: this.mapPayflowStatus(response.data.data.status),
        reference: response.data.data.reference,
        amount: response.data.data.amount_in_cents / 100,
        currency: response.data.data.currency,
        createdAt: new Date(response.data.data.created_at),
        message: response.data.data.status_message
      };
    } catch (error) {
      console.error('Error getting payment status from Payflow:', error);
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }

  private simulatePayment(paymentRequest: PaymentRequest): PaymentResponse {
    // Simulación: 80% de probabilidad de éxito
    const isSuccess = Math.random() > 0.2;
    
    return {
      id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: isSuccess ? 'APPROVED' : 'DECLINED',
      reference: paymentRequest.reference,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      createdAt: new Date(),
      message: isSuccess ? 'Payment approved successfully' : 'Payment declined by issuer'
    };
  }

  private simulatePaymentStatus(paymentId: string): PaymentResponse {
    return {
      id: paymentId,
      status: 'APPROVED',
      reference: `ref_${paymentId}`,
      amount: 100000,
      currency: 'COP',
      createdAt: new Date(),
      message: 'Payment approved successfully'
    };
  }

  private mapPayflowStatus(payflowStatus: string): 'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR' {
    switch (payflowStatus?.toUpperCase()) {
      case 'APPROVED':
        return 'APPROVED';
      case 'DECLINED':
        return 'DECLINED';
      case 'PENDING':
        return 'PENDING';
      default:
        return 'ERROR';
    }
  }
}