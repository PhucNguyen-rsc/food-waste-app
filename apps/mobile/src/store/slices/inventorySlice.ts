import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodItem } from './foodItemsSlice';

interface InventoryState {
  items: FoodItem[];
  loading: boolean;
  error: string | null;
  filters: {
    category: string | null;
    status: string | null;
  };
}

const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    status: null,
  },
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<FoodItem[]>) => {
      state.items = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.status = action.payload;
    },
  },
});

export const {
  setItems,
  setLoading,
  setError,
  updateItemQuantity,
  setCategoryFilter,
  setStatusFilter,
} = inventorySlice.actions;

export default inventorySlice.reducer; 