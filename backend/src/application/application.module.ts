import { Module } from '@nestjs/common';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { GetProductsUseCase } from './use-cases/get-products.use-case';
import { GetTransactionUseCase } from './use-cases/get-transaction.use-case';
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';
import { CreateDeliveryUseCase } from './use-cases/create-delivery.use-case';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [
    CreateTransactionUseCase,
    GetProductsUseCase,
    GetTransactionUseCase,
    CreateCustomerUseCase,
    CreateDeliveryUseCase
  ],
  exports: [
    CreateTransactionUseCase,
    GetProductsUseCase,
    GetTransactionUseCase,
    CreateCustomerUseCase,
    CreateDeliveryUseCase
  ]
})
export class ApplicationModule {}