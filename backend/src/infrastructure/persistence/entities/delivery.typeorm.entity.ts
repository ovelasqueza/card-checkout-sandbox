import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { TransactionTypeOrmEntity } from './transaction.typeorm.entity';

@Entity('deliveries')
export class DeliveryTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'transaction_id', type: 'uuid' })
  transactionId: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => TransactionTypeOrmEntity)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionTypeOrmEntity;
}