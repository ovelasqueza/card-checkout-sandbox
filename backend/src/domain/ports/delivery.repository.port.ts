import { Delivery, DeliveryStatus } from '../entities/delivery.entity';

export interface DeliveryRepositoryPort {
  findById(id: string): Promise<Delivery | null>;
  findByTransactionId(transactionId: string): Promise<Delivery | null>;
  findByStatus(status: DeliveryStatus): Promise<Delivery[]>;
  findAll(): Promise<Delivery[]>;
  save(delivery: Delivery): Promise<Delivery>;
  update(delivery: Delivery): Promise<Delivery>;
  delete(id: string): Promise<void>;
}