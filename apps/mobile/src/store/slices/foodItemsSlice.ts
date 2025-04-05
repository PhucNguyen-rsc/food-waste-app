import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  quantity: number;
  expiryDate: string;
  images: string[];
  category: 'MEAT' | 'DAIRY' | 'PRODUCE' | 'BAKERY' | 'PREPARED' | 'OTHER';
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'EXPIRED';
  businessId: string;
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
  },
});

export const { setFoodItems, addFoodItem, updateFoodItem, deleteFoodItem } = foodItemsSlice.actions;
export default foodItemsSlice.reducer; 