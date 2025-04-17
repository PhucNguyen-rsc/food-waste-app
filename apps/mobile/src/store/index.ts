// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import foodItemsReducer from './slices/foodItemsSlice';
import ordersReducer from './slices/ordersSlice';
import cartReducer from './cartSlice'; // Added cart reducer

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    foodItems: foodItemsReducer,
    orders: ordersReducer,
    cart: cartReducer, // Registered cart reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Pre-typed versions of `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
