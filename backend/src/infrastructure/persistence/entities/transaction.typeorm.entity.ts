import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CustomerTypeOrmEntity } from './customer.typeorm.entity';
import { ProductTypeOrmEntity } from './product.typeorm.entity';

@Entity('transactions')
export class TransactionTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'payflow_transaction_id', type: 'varchar', length: 255, nullable: true })
  payflowTransactionId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CustomerTypeOrmEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomerTypeOrmEntity;

  @ManyToOne(() => ProductTypeOrmEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductTypeOrmEntity;
}