export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export class Delivery {
  constructor(
    public readonly id: string,
    public readonly transactionId: string,
    public readonly address: string,
    public status: DeliveryStatus,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public markAsInTransit(): void {
    if (this.status !== DeliveryStatus.PENDING) {
      throw new Error('Only pending deliveries can be marked as in transit');
    }
    this.status = DeliveryStatus.IN_TRANSIT;
    this.updatedAt = new Date();
  }

  public markAsDelivered(): void {
    if (this.status !== DeliveryStatus.IN_TRANSIT) {
      throw new Error('Only in-transit deliveries can be marked as delivered');
    }
    this.status = DeliveryStatus.DELIVERED;
    this.updatedAt = new Date();
  }

  public cancel(): void {
    if (this.status === DeliveryStatus.DELIVERED) {
      throw new Error('Cannot cancel a delivered order');
    }
    this.status = DeliveryStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  public isPending(): boolean {
    return this.status === DeliveryStatus.PENDING;
  }

  public isDelivered(): boolean {
    return this.status === DeliveryStatus.DELIVERED;
  }
}