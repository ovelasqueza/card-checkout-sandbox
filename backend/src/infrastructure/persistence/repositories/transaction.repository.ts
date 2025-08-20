import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from '../../../domain/entities/transaction.entity';
import { TransactionRepositoryPort } from '../../../domain/ports/transaction.repository.port';
import { TransactionTypeOrmEntity } from '../entities/transaction.typeorm.entity';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class TransactionRepository implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(TransactionTypeOrmEntity)
    private readonly repository: Repository<TransactionTypeOrmEntity>
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async findByCustomerId(customerId: string): Promise<Transaction[]> {
    const entities = await this.repository.find({ where: { customerId } });
    return entities.map(TransactionMapper.toDomain);
  }

  async findByStatus(status: TransactionStatus): Promise<Transaction[]> {
    const entities = await this.repository.find({ where: { status } });
    return entities.map(TransactionMapper.toDomain);
  }

  async findAll(): Promise<Transaction[]> {
    const entities = await this.repository.find();
    return entities.map(TransactionMapper.toDomain);
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const entity = TransactionMapper.toPersistence(transaction);
    const savedEntity = await this.repository.save(entity);
    return TransactionMapper.toDomain(savedEntity);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const entity = TransactionMapper.toPersistence(transaction);
    await this.repository.update(transaction.id, entity);
    const updatedEntity = await this.repository.findOne({ where: { id: transaction.id } });
    return TransactionMapper.toDomain(updatedEntity!);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}