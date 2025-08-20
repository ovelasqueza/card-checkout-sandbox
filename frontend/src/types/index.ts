export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export interface Transaction {
  id?: number;
  productId: number;
  customerId?: number;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  createdAt?: string;
  paymentData?: Partial<PaymentData>; // Solo datos no sensibles
}

export interface AppState {
  currentStep: number;
  selectedProduct: Product | null;
  customer: Customer | null;
  paymentData: Partial<PaymentData> | null;
  transaction: Transaction | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}