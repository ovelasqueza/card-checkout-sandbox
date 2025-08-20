import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Transaction, PaymentData } from '../../types';
import axios from 'axios';
import { createApiConfig } from '../../config/api';

interface TransactionState {
  currentTransaction: Transaction | null;
  paymentData: Partial<PaymentData> | null;
  currentStep: number;
  quantity: number;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  currentTransaction: null,
  paymentData: null,
  currentStep: 1,
  quantity: 1,
  loading: false,
  error: null,
};

// Async thunks
export const createTransaction = createAsyncThunk(
  'transaction/create',
  async (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const apiConfig = createApiConfig();
    const response = await axios.post('/transactions', transactionData, apiConfig);
    return response.data;
  }
);

export const processPayment = createAsyncThunk(
  'transaction/processPayment',
  async ({ transactionId }: { transactionId: number; paymentData: PaymentData }) => {
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular éxito/fallo aleatorio (80% éxito)
    const success = Math.random() > 0.2;

    if (success) {
      const response = await axios.patch(`${createApiConfig().baseURL}/transactions/${transactionId}`, {
        status: 'success'
      });
      return response.data;
    } else {
      throw new Error('Error en el procesamiento del pago');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 5) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    setPaymentData: (state, action: PayloadAction<Partial<PaymentData>>) => {
      // Solo guardar datos no sensibles
      const { cardNumber, cvv, ...safeData } = action.payload;
      state.paymentData = {
        ...state.paymentData,
        ...safeData,
        // Solo guardar últimos 4 dígitos de la tarjeta
        cardNumber: cardNumber ? `****-****-****-${cardNumber.slice(-4)}` : undefined,
      };
    },
    clearTransaction: (state) => {
      state.currentTransaction = null;
      state.paymentData = null;
      state.currentStep = 1;
      state.quantity = 1;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al crear la transacción';
      })
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTransaction = action.payload;
        state.currentStep = 4;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error en el pago';
        state.currentStep = 4;
        if (state.currentTransaction) {
          state.currentTransaction.status = 'failed';
        }
      });
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  setQuantity,
  setPaymentData,
  clearTransaction,
  clearError,
} = transactionSlice.actions;

export default transactionSlice.reducer;