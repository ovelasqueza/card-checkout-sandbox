import { IsString, IsNumber, IsEmail, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerAddress: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;
}

export class TransactionResponseDto {
  id: string;
  customerId: string;
  productId: string;
  status: string;
  amount: number;
  payflowTransactionId?: string;
  createdAt: Date;
}