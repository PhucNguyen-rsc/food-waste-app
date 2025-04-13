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
  OrderSuccessScreen: undefined;
  Profile: undefined;
  Settings: undefined;
  ChangePassword: undefined;

  // Courier
  CourierHome: undefined;
  Deliveries: undefined;
  CourierProfile: undefined;
};
