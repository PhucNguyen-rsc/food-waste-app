import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

// Onboarding / Auth Screens
import GetStartedScreen from '@/screens/GetStartedScreen';
import SignInScreen from '@/screens/SignInScreen';
import SignUpScreen from '@/screens/SignUpScreen';

// Role Selection
import RoleSelectionScreen from '@/screens/RoleSelectionScreen';

// Business Screens
import BusinessHomeScreen from '@/screens/business/BusinessHomeScreen';
import AddItemScreen from '@/screens/business/AddItemScreen';
import ManageOrderScreen from '@/screens/business/ManageOrderScreen';
import BusinessProfileScreen from '@/screens/business/BusinessProfileScreen';
import AnalyticsScreen from '@/screens/business/AnalyticsScreen';
import UpdatePriceScreen from '@/screens/business/UpdatePriceScreen';
import InventoryScreen from '@/screens/business/InventoryScreen';

// Consumer Screens
import ConsumerHomeScreen from '@/screens/consumer/ConsumerHomeScreen';
import ProfileScreen from '@/screens/consumer/ProfileScreen';
import ProductDetailScreen from '@/screens/consumer/ProductDetailScreen';
import SettingsScreen from '@/screens/consumer/SettingsScreen';
import ChangePasswordScreen from '@/screens/consumer/ChangePasswordScreen';
import CartScreen from '@/screens/consumer/CartScreen';
import CheckoutScreen from '@/screens/consumer/CheckoutScreen';
import OrderSuccessScreen from '@/screens/consumer/OrderSuccessScreen';
import OrderDetailScreen from '@/screens/consumer/OrderDetailScreen';

import { useAppSelector } from '@/store';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'RoleSelection' : 'GetStarted'}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {/* Onboarding / Auth */}
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Role Selection */}
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

        {/* Business Screens */}
        <Stack.Screen name="BusinessHome" component={BusinessHomeScreen} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        <Stack.Screen name="UpdatePrice" component={UpdatePriceScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="ManageOrders" component={ManageOrderScreen} />
        <Stack.Screen name="BusinessProfile" component={BusinessProfileScreen} />

        {/* Consumer Screens */}
        <Stack.Screen name="ConsumerHome" component={ConsumerHomeScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} />
        <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
