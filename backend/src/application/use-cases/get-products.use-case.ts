import { Injectable, Inject } from '@nestjs/common';
import type { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { Product } from '../../domain/entities/product.entity';

export class ProductResponseDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
}

@Injectable()
export class GetProductsUseCase {
  constructor(@Inject('ProductRepositoryPort') private readonly productRepository: ProductRepositoryPort) {}

  async execute(): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAvailableProducts();
    return products.map(this.mapToResponseDto);
  }

  async getById(id: string): Promise<ProductResponseDto | null> {
    const product = await this.productRepository.findById(id);
    return product ? this.mapToResponseDto(product) : null;
  }

  private mapToResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: product.createdAt
    };
  }
}