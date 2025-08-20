import { Controller, Post, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from '../../application/use-cases/get-transaction.use-case';
import { CreateTransactionDto, TransactionResponseDto } from '../../application/dtos/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase
  ) {}

  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto
  ): Promise<TransactionResponseDto> {
    try {
      return await this.createTransactionUseCase.execute(createTransactionDto);
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('stock insuficiente')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error.message.includes('ya existe')) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      if (error.message.includes('inválido')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      console.error('Error creating transaction:', error);
      throw new HttpException(
        'Error interno del servidor al crear la transacción',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getTransaction(@Param('id') id: string): Promise<TransactionResponseDto> {
    try {
      const transaction = await this.getTransactionUseCase.execute(id);
      if (!transaction) {
        throw new HttpException(
          'Transacción no encontrada',
          HttpStatus.NOT_FOUND
        );
      }
      return transaction;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener la transacción',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}