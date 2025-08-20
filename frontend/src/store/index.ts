import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productsReducer from './slices/productsSlice';
import transactionReducer from './slices/transactionSlice';
import customerReducer from './slices/customerSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['transaction', 'customer'], // Solo persistir transacción y cliente
  blacklist: ['products'], // No persistir productos (se cargan del servidor)
};

const transactionPersistConfig = {
  key: 'transaction',
  storage,
  blacklist: ['loading', 'error'], // No persistir estados de carga y error
};

const rootReducer = combineReducers({
  products: productsReducer,
  transaction: persistReducer(transactionPersistConfig, transactionReducer),
  customer: customerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;