import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../../domain/entities/customer.entity';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { CustomerTypeOrmEntity } from '../entities/customer.typeorm.entity';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerTypeOrmEntity)
    private readonly repository: Repository<CustomerTypeOrmEntity>
  ) {}

  async findById(id: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Customer[]> {
    const entities = await this.repository.find();
    return entities.map(CustomerMapper.toDomain);
  }

  async save(customer: Customer): Promise<Customer> {
    const entity = CustomerMapper.toPersistence(customer);
    const savedEntity = await this.repository.save(entity);
    return CustomerMapper.toDomain(savedEntity);
  }

  async update(customer: Customer): Promise<Customer> {
    const entity = CustomerMapper.toPersistence(customer);
    await this.repository.update(customer.id, entity);
    const updatedEntity = await this.repository.findOne({ where: { id: customer.id } });
    return CustomerMapper.toDomain(updatedEntity!);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}