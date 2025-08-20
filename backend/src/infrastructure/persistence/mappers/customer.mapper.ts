import { Customer } from '../../../domain/entities/customer.entity';
import { CustomerTypeOrmEntity } from '../entities/customer.typeorm.entity';

export class CustomerMapper {
  static toDomain(entity: CustomerTypeOrmEntity): Customer {
    return new Customer(
      entity.id,
      entity.name,
      entity.email,
      entity.address,
      entity.phone,
      entity.createdAt
    );
  }

  static toPersistence(domain: Customer): CustomerTypeOrmEntity {
    const entity = new CustomerTypeOrmEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    entity.address = domain.address;
    entity.phone = domain.phone;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}