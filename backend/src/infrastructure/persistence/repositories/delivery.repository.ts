import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery, DeliveryStatus } from '../../../domain/entities/delivery.entity';
import { DeliveryRepositoryPort } from '../../../domain/ports/delivery.repository.port';
import { DeliveryTypeOrmEntity } from '../entities/delivery.typeorm.entity';
import { DeliveryMapper } from '../mappers/delivery.mapper';

@Injectable()
export class DeliveryRepository implements DeliveryRepositoryPort {
  constructor(
    @InjectRepository(DeliveryTypeOrmEntity)
    private readonly repository: Repository<DeliveryTypeOrmEntity>
  ) {}

  async findById(id: string): Promise<Delivery | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? DeliveryMapper.toDomain(entity) : null;
  }

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    const entity = await this.repository.findOne({ where: { transactionId } });
    return entity ? DeliveryMapper.toDomain(entity) : null;
  }

  async findByStatus(status: DeliveryStatus): Promise<Delivery[]> {
    const entities = await this.repository.find({ where: { status } });
    return entities.map(DeliveryMapper.toDomain);
  }

  async findAll(): Promise<Delivery[]> {
    const entities = await this.repository.find();
    return entities.map(DeliveryMapper.toDomain);
  }

  async save(delivery: Delivery): Promise<Delivery> {
    const entity = DeliveryMapper.toPersistence(delivery);
    const savedEntity = await this.repository.save(entity);
    return DeliveryMapper.toDomain(savedEntity);
  }

  async update(delivery: Delivery): Promise<Delivery> {
    const entity = DeliveryMapper.toPersistence(delivery);
    await this.repository.update(delivery.id, entity);
    const updatedEntity = await this.repository.findOne({ where: { id: delivery.id } });
    return DeliveryMapper.toDomain(updatedEntity!);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}