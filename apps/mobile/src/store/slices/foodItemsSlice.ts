import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FoodItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice: number;
  quantity: number;
  category: string;
  status: string;
  businessId: string;
  discountPercentage?: number;
  discountThreshold?: number;
  expiryDate: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface FoodItemsState {
  items: FoodItem[];
  loading: boolean;
  error: string | null;
}

const initialState: FoodItemsState = {
  items: [],
  loading: false,
  error: null,
};

const foodItemsSlice = createSlice({
  name: 'foodItems',
  initialState,
  reducers: {
    setFoodItems: (state, action: PayloadAction<FoodItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addFoodItem: (state, action: PayloadAction<FoodItem>) => {
      state.items.push(action.payload);
    },
    updateFoodItem: (state, action: PayloadAction<FoodItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteFoodItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { 
  setFoodItems, 
  addFoodItem, 
  updateFoodItem, 
  deleteFoodItem,
  setLoading,
  setError,
} = foodItemsSlice.actions;
export default foodItemsSlice.reducer; 