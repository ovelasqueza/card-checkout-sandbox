import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '../../types';
import axios from 'axios';
import { createApiConfig } from '../../config/api';

interface CustomerState {
  currentCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  currentCustomer: null,
  loading: false,
  error: null,
};

// Async thunks
export const createCustomer = createAsyncThunk(
  'customer/create',
  async (customerData: Omit<Customer, 'id'>) => {
    const apiConfig = createApiConfig();
    const response = await axios.post('/customers', customerData, apiConfig);
    return response.data;
  }
);

export const updateCustomer = createAsyncThunk(
  'customer/update',
  async ({ id, customerData }: { id: number; customerData: Partial<Customer> }) => {
    const apiConfig = createApiConfig();
    const response = await axios.patch(`/customers/${id}`, customerData, apiConfig);
    return response.data;
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerData: (state, action: PayloadAction<Customer>) => {
      state.currentCustomer = action.payload;
    },
    updateCustomerField: (state, action: PayloadAction<Partial<Customer>>) => {
      if (state.currentCustomer) {
        state.currentCustomer = { ...state.currentCustomer, ...action.payload };
      } else {
        state.currentCustomer = action.payload as Customer;
      }
    },
    clearCustomer: (state) => {
      state.currentCustomer = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al crear el cliente';
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.currentCustomer = action.payload;
      });
  },
});

export const {
  setCustomerData,
  updateCustomerField,
  clearCustomer,
  clearError,
} = customerSlice.actions;

export default customerSlice.reducer;