import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeOrmEntity } from './persistence/entities/product.typeorm.entity';
import { CustomerTypeOrmEntity } from './persistence/entities/customer.typeorm.entity';
import { TransactionTypeOrmEntity } from './persistence/entities/transaction.typeorm.entity';
import { DeliveryTypeOrmEntity } from './persistence/entities/delivery.typeorm.entity';
import { ProductRepository } from './persistence/repositories/product.repository';
import { CustomerRepository } from './persistence/repositories/customer.repository';
import { TransactionRepository } from './persistence/repositories/transaction.repository';
import { DeliveryRepository } from './persistence/repositories/delivery.repository';
import { PayflowService } from './external-services/payflow.service';
import { ProductRepositoryPort } from '../domain/ports/product.repository.port';
import { CustomerRepositoryPort } from '../domain/ports/customer.repository.port';
import { TransactionRepositoryPort } from '../domain/ports/transaction.repository.port';
import { DeliveryRepositoryPort } from '../domain/ports/delivery.repository.port';
import { PaymentServicePort } from '../domain/ports/payment.service.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductTypeOrmEntity,
      CustomerTypeOrmEntity,
      TransactionTypeOrmEntity,
      DeliveryTypeOrmEntity
    ])
  ],
  providers: [
    {
      provide: 'ProductRepositoryPort',
      useClass: ProductRepository
    },
    {
      provide: 'CustomerRepositoryPort',
      useClass: CustomerRepository
    },
    {
      provide: 'TransactionRepositoryPort',
      useClass: TransactionRepository
    },
    {
      provide: 'DeliveryRepositoryPort',
      useClass: DeliveryRepository
    },
    {
      provide: 'PaymentServicePort',
      useClass: PayflowService
    }
  ],
  exports: [
    'ProductRepositoryPort',
    'CustomerRepositoryPort',
    'TransactionRepositoryPort',
    'DeliveryRepositoryPort',
    'PaymentServicePort'
  ]
})
export class InfrastructureModule {}