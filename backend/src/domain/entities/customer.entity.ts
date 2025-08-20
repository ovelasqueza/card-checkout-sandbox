export class Customer {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly address: string,
    public readonly phone: string,
    public readonly createdAt: Date = new Date()
  ) {}

  public isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  public isValidPhone(): boolean {
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    return phoneRegex.test(this.phone.replace(/\s/g, ''));
  }
}