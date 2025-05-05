import { NavigatorScreenParams } from '@react-navigation/native';
import { PaymentType } from '@food-waste/types';
import { Product } from '@/types'; // Ensure this exists and is typed correctly

// ==========================
// Courier Stack
// ==========================
export type CourierStackParamList = {
  CourierTabs: undefined;
  CourierHome: undefined;
  ActiveDelivery: undefined;
  DeliveryDetails: { deliveryId: string };
  Earnings: undefined;
  History: undefined;
  CourierProfile: undefined;
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
  Home: undefined;
  AddItem: undefined;
  Orders: undefined;
  Analytics: undefined;
  EditItem: { itemId: string };
  Inventory: undefined;
  Profile: undefined;
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

  // Nested Navigators
  Business: NavigatorScreenParams<BusinessStackParamList>;
  Consumer: NavigatorScreenParams<ConsumerStackParamList>;
  Courier: NavigatorScreenParams<CourierStackParamList>;

  // Payment Screens
  NoPaymentMethod: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: { type: PaymentType };
  PaymentSuccess: undefined;
};
