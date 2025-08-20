import { Injectable, Inject } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { Delivery, DeliveryStatus } from '../../domain/entities/delivery.entity';
import type { DeliveryRepositoryPort } from '../../domain/ports/delivery.repository.port';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class DeliveryResponseDto {
  id: string;
  transactionId: string;
  address: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    @Inject('DeliveryRepositoryPort') private readonly deliveryRepository: DeliveryRepositoryPort,
    @Inject('TransactionRepositoryPort') private readonly transactionRepository: TransactionRepositoryPort
  ) {}

  async execute(dto: CreateDeliveryDto): Promise<DeliveryResponseDto> {
    try {
      // Verificar que la transacción existe y está exitosa
      const transaction = await this.transactionRepository.findById(dto.transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (!transaction.isSuccess()) {
        throw new Error('Transaction must be successful to create delivery');
      }

      // Verificar que no existe ya una entrega para esta transacción
      const existingDelivery = await this.deliveryRepository.findByTransactionId(dto.transactionId);
      if (existingDelivery) {
        throw new Error('Delivery already exists for this transaction');
      }

      const delivery = new Delivery(
        uuidv4(),
        dto.transactionId,
        dto.address,
        DeliveryStatus.PENDING
      );

      const savedDelivery = await this.deliveryRepository.save(delivery);
      return this.mapToResponseDto(savedDelivery);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private mapToResponseDto(delivery: Delivery): DeliveryResponseDto {
    return {
      id: delivery.id,
      transactionId: delivery.transactionId,
      address: delivery.address,
      status: delivery.status,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt
    };
  }
}