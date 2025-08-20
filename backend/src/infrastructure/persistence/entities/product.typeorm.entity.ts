import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('products')
export class ProductTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}