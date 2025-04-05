export type RootStackParamList = {
  // Onboarding / Auth
  GetStarted: undefined;
  SignIn: undefined;
  SignUp: undefined;

  // Role selection (after user logs in)
  RoleSelection: undefined;

  // Business owner side
  BusinessHome: undefined;
  Analytics: undefined;
  AddItem: undefined;
  UpdatePrice: { itemId: string };
  Inventory: undefined;
  ManageOrders: undefined;
  BusinessProfile: undefined;

  // Consumer side
  ConsumerHome: undefined;
  ConsumerProfile: undefined;

  // Courier side
  CourierHome: undefined;
  CourierProfile: undefined;
};
