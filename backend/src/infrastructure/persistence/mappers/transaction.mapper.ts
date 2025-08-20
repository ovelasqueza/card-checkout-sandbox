import { Transaction, TransactionStatus } from '../../../domain/entities/transaction.entity';
import { TransactionTypeOrmEntity } from '../entities/transaction.typeorm.entity';

export class TransactionMapper {
  static toDomain(entity: TransactionTypeOrmEntity): Transaction {
    return new Transaction(
      entity.id,
      entity.customerId,
      entity.productId,
      entity.status as TransactionStatus,
      Number(entity.amount),
      entity.payflowTransactionId,
      entity.createdAt,
      entity.updatedAt
    );
  }

  static toPersistence(domain: Transaction): TransactionTypeOrmEntity {
    const entity = new TransactionTypeOrmEntity();
    entity.id = domain.id;
    entity.customerId = domain.customerId;
    entity.productId = domain.productId;
    entity.status = domain.status;
    entity.amount = domain.amount;
    entity.payflowTransactionId = domain.payflowTransactionId;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}