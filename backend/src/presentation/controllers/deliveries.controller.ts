import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CreateDeliveryUseCase } from '../../application/use-cases/create-delivery.use-case';
import { CreateDeliveryDto, DeliveryResponseDto } from '../../application/use-cases/create-delivery.use-case';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly createDeliveryUseCase: CreateDeliveryUseCase) {}

  @Post()
  async createDelivery(
    @Body() createDeliveryDto: CreateDeliveryDto
  ): Promise<DeliveryResponseDto> {
    try {
      return await this.createDeliveryUseCase.execute(createDeliveryDto);
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('no exitosa')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error.message.includes('ya existe')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      
      console.error('Error creating delivery:', error);
      throw new HttpException(
        'Error interno del servidor al crear la entrega',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}