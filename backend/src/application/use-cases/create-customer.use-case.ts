import { Injectable, Inject } from '@nestjs/common';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../../domain/entities/customer.entity';
import type { CustomerRepositoryPort } from '../../domain/ports/customer.repository.port';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class CustomerResponseDto {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  createdAt: Date;
}

@Injectable()
export class CreateCustomerUseCase {
  constructor(@Inject('CustomerRepositoryPort') private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    try {
      const existingCustomer = await this.customerRepository.findByEmail(dto.email);
      if (existingCustomer) {
        throw new Error('Email already exists');
      }

      const customer = new Customer(
        uuidv4(),
        dto.name,
        dto.email,
        dto.address,
        dto.phone
      );

      if (!customer.isValidEmail()) {
        throw new Error('Invalid email format');
      }

      if (!customer.isValidPhone()) {
        throw new Error('Invalid phone format');
      }

      const savedCustomer = await this.customerRepository.save(customer);
      return this.mapToResponseDto(savedCustomer);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private mapToResponseDto(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      address: customer.address,
      phone: customer.phone,
      createdAt: customer.createdAt
    };
  }
}