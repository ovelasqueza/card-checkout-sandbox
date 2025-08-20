import { Transaction, TransactionStatus } from '../entities/transaction.entity';

export interface TransactionRepositoryPort {
  findById(id: string): Promise<Transaction | null>;
  findByCustomerId(customerId: string): Promise<Transaction[]>;
  findByStatus(status: TransactionStatus): Promise<Transaction[]>;
  findAll(): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  delete(id: string): Promise<void>;
}