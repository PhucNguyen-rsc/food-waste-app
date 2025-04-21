import { PaymentType } from '@food-waste/types';
import { Order } from '@/types';

export type RootStackParamList = {
  // Onboarding / Auth
  GetStarted: undefined;
  SignIn: undefined;
  SignUp: undefined;

  // Role Selection
  RoleSelection: undefined;

  // Business
  BusinessHome: undefined;
  AddItem: undefined;
  ManageOrders: undefined;
  Analytics: undefined;
  UpdatePrice: undefined;
  Inventory: undefined;
  BusinessProfile: undefined;

  // Consumer
  ConsumerHome: undefined;
  ProductDetail: { product: any }; // or your actual type
  CartScreen: undefined;
  CheckoutScreen: undefined;
  OrderSuccessScreen: {
    orderId: string;
  };
  Profile: undefined;
  Settings: undefined;
  ChangePassword: undefined;

  // Courier
  CourierHome: undefined;
  Deliveries: undefined;
  CourierProfile: undefined;

  // Payment
  NoPaymentMethod: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: { type: PaymentType };
  PaymentSuccess: undefined;

  Orders: undefined;
  OrderDetailScreen: { order: Order };
};
