import { Delivery, DeliveryStatus } from '../../../domain/entities/delivery.entity';
import { DeliveryTypeOrmEntity } from '../entities/delivery.typeorm.entity';

export class DeliveryMapper {
  static toDomain(entity: DeliveryTypeOrmEntity): Delivery {
    return new Delivery(
      entity.id,
      entity.transactionId,
      entity.address,
      entity.status as DeliveryStatus,
      entity.createdAt,
      entity.updatedAt
    );
  }

  static toPersistence(domain: Delivery): DeliveryTypeOrmEntity {
    const entity = new DeliveryTypeOrmEntity();
    entity.id = domain.id;
    entity.transactionId = domain.transactionId;
    entity.address = domain.address;
    entity.status = domain.status;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}