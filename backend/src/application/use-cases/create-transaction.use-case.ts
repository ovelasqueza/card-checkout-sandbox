import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../domain/entities/product.entity';
import { Customer } from '../../domain/entities/customer.entity';
import { Transaction, TransactionStatus } from '../../domain/entities/transaction.entity';
import { Delivery, DeliveryStatus } from '../../domain/entities/delivery.entity';
import type { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import type { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import type { DeliveryRepositoryPort } from '../../domain/ports/delivery.repository.port';
import type { PaymentServicePort } from '../../domain/ports/payment.service.port';
import { PaymentRequest } from '../../domain/ports/payment.service.port';
import { CreateTransactionDto, TransactionResponseDto } from '../dtos/create-transaction.dto';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ProductRepositoryPort') private readonly productRepository: ProductRepositoryPort,
    @Inject('CustomerRepositoryPort') private readonly customerRepository: CustomerRepositoryPort,
    @Inject('TransactionRepositoryPort') private readonly transactionRepository: TransactionRepositoryPort,
    @Inject('DeliveryRepositoryPort') private readonly deliveryRepository: DeliveryRepositoryPort,
    @Inject('PaymentServicePort') private readonly paymentService: PaymentServicePort
  ) {}

  async execute(dto: CreateTransactionDto): Promise<TransactionResponseDto> {
    try {
      // Verificar stock
      const product = await this.productRepository.findById(dto.productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (!product.hasStock(dto.quantity)) {
        throw new Error('Insufficient stock');
      }

      // Verificar o crear cliente
      let customer = await this.customerRepository.findById(dto.customerId);
      if (!customer) {
        customer = new Customer(
          dto.customerId,
          dto.customerName,
          dto.customerEmail,
          dto.customerAddress,
          dto.customerPhone
        );
        await this.customerRepository.save(customer);
      }

      const transactionId = uuidv4();
      const amount = product.price * dto.quantity;
      const transaction = new Transaction(
        transactionId,
        customer.id,
        product.id,
        TransactionStatus.PENDING,
        amount
      );

      await this.transactionRepository.save(transaction);

      const paymentRequest: PaymentRequest = {
        amount: amount,
        currency: 'COP',
        customerEmail: customer.email,
        reference: transactionId,
        description: `Purchase of ${product.name}`
      };

      const paymentResponse = await this.paymentService.processPayment(paymentRequest);

      if (paymentResponse.status === 'APPROVED') {
        transaction.markAsSuccess(paymentResponse.id);
        await this.transactionRepository.update(transaction);

        product.reduceStock(dto.quantity);
        await this.productRepository.update(product);

        // Crear entrega
        const delivery = new Delivery(
          uuidv4(),
          transaction.id,
          customer.address,
          DeliveryStatus.PENDING
        );
        await this.deliveryRepository.save(delivery);

        return this.mapToResponseDto(transaction);
      } else {
        transaction.markAsFailed();
        await this.transactionRepository.update(transaction);
        throw new Error(`Payment failed: ${paymentResponse.message}`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private mapToResponseDto(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      customerId: transaction.customerId,
      productId: transaction.productId,
      status: transaction.status,
      amount: transaction.amount,
      payflowTransactionId: transaction.payflowTransactionId,
      createdAt: transaction.createdAt
    };
  }
}