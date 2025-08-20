export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly productId: string,
    public status: TransactionStatus,
    public readonly amount: number,
    public payflowTransactionId?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public markAsSuccess(payflowTransactionId: string): void {
    if (this.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can be marked as success');
    }
    this.status = TransactionStatus.SUCCESS;
    this.payflowTransactionId = payflowTransactionId;
    this.updatedAt = new Date();
  }

  public markAsFailed(): void {
    if (this.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can be marked as failed');
    }
    this.status = TransactionStatus.FAILED;
    this.updatedAt = new Date();
  }

  public isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  public isSuccess(): boolean {
    return this.status === TransactionStatus.SUCCESS;
  }

  public isFailed(): boolean {
    return this.status === TransactionStatus.FAILED;
  }
}