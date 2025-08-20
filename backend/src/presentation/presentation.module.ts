import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { TransactionsController } from './controllers/transactions.controller';
import { CustomersController } from './controllers/customers.controller';
import { DeliveriesController } from './controllers/deliveries.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [
    ProductsController,
    TransactionsController,
    CustomersController,
    DeliveriesController
  ]
})
export class PresentationModule {}