import { Injectable, Inject } from '@nestjs/common';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionResponseDto } from '../dtos/create-transaction.dto';

@Injectable()
export class GetTransactionUseCase {
  constructor(@Inject('TransactionRepositoryPort') private readonly transactionRepository: TransactionRepositoryPort) {}

  async execute(id: string): Promise<TransactionResponseDto | null> {
    const transaction = await this.transactionRepository.findById(id);
    return transaction ? this.mapToResponseDto(transaction) : null;
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