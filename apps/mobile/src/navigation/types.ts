import { NavigatorScreenParams } from '@react-navigation/native';
import { PaymentType } from '@food-waste/types';
import { Order } from '@/types'; // Ensure this exists and is typed correctly
import { Product } from '@/types'; // Ensure this exists and is typed correctly

// ==========================
// Courier Stack
// ==========================
export type CourierStackParamList = {
  CourierHome: undefined;
  ActiveDelivery: undefined;
  DeliveryDetails: { deliveryId: string };
  DeliveryHistory: undefined;
  Earnings: undefined;
  CourierProfile: undefined;
  History: undefined;
};

// ==========================
// Consumer Stack
// ==========================
export type ConsumerStackParamList = {
  ConsumerTabs: undefined;
  Home: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
  ProductDetail: { product: Product };
  Settings: undefined;
  ChangePassword: undefined;
  CheckoutScreen: undefined;
  OrderSuccessScreen: { orderId: string };
  OrderDetails: { orderId: string };
  BusinessDetails: undefined;
};

// ==========================
// Business Stack
// ==========================
export type BusinessStackParamList = {
  BusinessTabs: undefined;
  BusinessHome: undefined;
  AddItem: undefined;
  ManageOrders: undefined;
  Analytics: undefined;
  UpdatePrice: { itemId: string };
  Inventory: undefined;
  BusinessProfile: undefined;
};

// ==========================
// Root Stack (high level)
// ==========================
export type RootStackParamList = {
  // Onboarding / Auth
  GetStarted: undefined;
  SignIn: undefined;
  SignUp: undefined;

  // Role Selection
  RoleSelection: undefined;

  // Consumer Screens (direct from root)
  ConsumerHome: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  CheckoutScreen: undefined;
  OrderSuccessScreen: { orderId: string };
  OrderDetailScreen: { order: Order };

  // Courier Screens
  CourierHome: undefined;
  ActiveDelivery: undefined;
  DeliveryDetails: { deliveryId: string };
  Earnings: undefined;
  History: undefined;
  CourierProfile: undefined;

  // Business Screens
  BusinessHome: undefined;
  AddItem: undefined;
  ManageOrders: undefined;
  Analytics: undefined;
  UpdatePrice: { itemId: string };
  Inventory: undefined;
  BusinessProfile: undefined;

  // Payment Screens
  NoPaymentMethod: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: { type: PaymentType };
  PaymentSuccess: undefined;

  // Nested Navigators (optional if you use stack containers)
  Courier?: NavigatorScreenParams<CourierStackParamList>;
  Consumer?: NavigatorScreenParams<ConsumerStackParamList>;
  Business?: NavigatorScreenParams<BusinessStackParamList>;
};
