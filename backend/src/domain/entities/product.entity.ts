export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public stock: number,
    public readonly createdAt: Date = new Date()
  ) {}

  public hasStock(quantity: number): boolean {
    return this.stock >= quantity;
  }

  public reduceStock(quantity: number): void {
    if (!this.hasStock(quantity)) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
  }

  public increaseStock(quantity: number): void {
    this.stock += quantity;
  }
}