import { Product } from '../../../domain/entities/product.entity';
import { ProductTypeOrmEntity } from '../entities/product.typeorm.entity';

export class ProductMapper {
  static toDomain(entity: ProductTypeOrmEntity): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.description,
      Number(entity.price),
      entity.stock,
      entity.createdAt
    );
  }

  static toPersistence(domain: Product): ProductTypeOrmEntity {
    const entity = new ProductTypeOrmEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.description = domain.description;
    entity.price = domain.price;
    entity.stock = domain.stock;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}