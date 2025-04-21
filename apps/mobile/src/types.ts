import { PaymentType } from '@food-waste/database';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  imageUrl?: string;
  businessId: string;
}

export interface CartState {
  items: CartItem[];
}

export interface AppState {
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

export interface FoodItemsState {
  items: any[];
  loading: boolean;
  error: string | null;
}

export interface OrdersState {
  orders: any[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  app: AppState;
  auth: AuthState;
  foodItems: FoodItemsState;
  orders: OrdersState;
  cart: CartState;
}

export type RootStackParamList = {
  ConsumerHome: undefined;
  BusinessHome: undefined;
  AddItem: undefined;
  UpdatePrice: { itemId: string };
  Inventory: undefined;
  Analytics: undefined;
  BusinessProfile: undefined;
  ManageOrder: undefined;
  Cart: undefined;
  Checkout: undefined;
  NoPaymentMethod: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: { type: PaymentType };
  PaymentSuccess: undefined;
  OrderSuccessScreen: undefined;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'CONSUMER' | 'BUSINESS';
  createdAt: string;
  updatedAt: string;
};

export type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  quantity: number;
  images: string[];
  businessId: string;
  category: string;
  status: 'AVAILABLE' | 'SOLD_OUT';
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  consumerId: string;
  businessId: string;
  items: OrderItem[];
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  foodItemId: string;
  quantity: number;
  price: number;
}; 