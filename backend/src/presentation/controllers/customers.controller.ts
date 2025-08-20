import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { CreateCustomerDto, CustomerResponseDto } from '../../application/use-cases/create-customer.use-case';

@Controller('customers')
export class CustomersController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto
  ): Promise<CustomerResponseDto> {
    try {
      return await this.createCustomerUseCase.execute(createCustomerDto);
    } catch (error) {
      if (error.message.includes('ya existe')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      if (error.message.includes('inválido')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      console.error('Error creating customer:', error);
      throw new HttpException(
        'Error interno del servidor al crear el cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}