import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { GetProductsUseCase, ProductResponseDto } from '../../application/use-cases/get-products.use-case';

@Controller('products')
export class ProductsController {
  constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

  @Get()
  async getAllProducts(): Promise<ProductResponseDto[]> {
    try {
      return await this.getProductsUseCase.execute();
    } catch (error) {
      throw new HttpException(
        'Error al obtener productos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<ProductResponseDto> {
    try {
      const product = await this.getProductsUseCase.getById(id);
      if (!product) {
        throw new HttpException(
          'Producto no encontrado',
          HttpStatus.NOT_FOUND
        );
      }
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el producto',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}