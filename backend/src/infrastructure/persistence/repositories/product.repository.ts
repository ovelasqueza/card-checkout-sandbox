import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Product } from '../../../domain/entities/product.entity';
import { ProductRepositoryPort } from '../../../domain/ports/product.repository.port';
import { ProductTypeOrmEntity } from '../entities/product.typeorm.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductRepository implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductTypeOrmEntity)
    private readonly repository: Repository<ProductTypeOrmEntity>
  ) {}

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find();
    return entities.map(ProductMapper.toDomain);
  }

  async save(product: Product): Promise<Product> {
    const entity = ProductMapper.toPersistence(product);
    const savedEntity = await this.repository.save(entity);
    return ProductMapper.toDomain(savedEntity);
  }

  async update(product: Product): Promise<Product> {
    const entity = ProductMapper.toPersistence(product);
    await this.repository.update(product.id, entity);
    const updatedEntity = await this.repository.findOne({ where: { id: product.id } });
    return ProductMapper.toDomain(updatedEntity!);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByName(name: string): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { name: name }
    });
    return entities.map(ProductMapper.toDomain);
  }

  async findAvailableProducts(): Promise<Product[]> {
    const entities = await this.repository.find({
      where: { stock: MoreThan(0) }
    });
    return entities.map(ProductMapper.toDomain);
  }
}