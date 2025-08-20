import { Product } from '../entities/product.entity';

export interface ProductRepositoryPort {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  findByName(name: string): Promise<Product[]>;
  findAvailableProducts(): Promise<Product[]>;
}