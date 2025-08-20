import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';
import axios from 'axios';
import { createApiConfig } from '../../config/api';

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const apiConfig = createApiConfig();
    const response = await axios.get('/products', apiConfig);
    return response.data;
  }
);

export const updateProductStock = createAsyncThunk(
  'products/updateStock',
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    const apiConfig = createApiConfig();
    const response = await axios.patch(`/products/${productId}/stock`, {
      quantity: -quantity // Reducir stock
    }, apiConfig);
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    selectProduct: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar productos';
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const updatedProduct = action.payload;
        const index = state.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        if (state.selectedProduct?.id === updatedProduct.id) {
          state.selectedProduct = updatedProduct;
        }
      });
  },
});

export const { selectProduct, clearSelectedProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;