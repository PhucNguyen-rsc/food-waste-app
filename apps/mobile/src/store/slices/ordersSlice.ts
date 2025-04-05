import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    foodItem: {
      name: string;
    };
  }>;
  deliveryAddress: string;
  totalAmount: number;
  createdAt: string;
}

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
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

export const { setOrders, setLoading, setError } = ordersSlice.actions;
export default ordersSlice.reducer; 