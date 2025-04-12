// src/navigation/RootNavigator.tsx

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
import ManageOrderScreen from '@/screens/business/ManageOrderScreen'; // ✅ Singular, matches file + export
import BusinessProfileScreen from '@/screens/business/BusinessProfileScreen';
import AnalyticsScreen from '@/screens/business/AnalyticsScreen';
import UpdatePriceScreen from '@/screens/business/UpdatePriceScreen';
import InventoryScreen from '@/screens/business/InventoryScreen';

// Consumer Screen
import ConsumerHomeScreen from '@/screens/consumer/ConsumerHomeScreen';
import ProfileScreen from '@/screens/consumer/ProfileScreen';
import ProductDetailScreen from '@/screens/consumer/ProductDetailScreen';
import SettingsScreen from '@/screens/consumer/SettingsScreen';
import ChangePasswordScreen from '@/screens/consumer/ChangePasswordScreen';
// (Optional) Courier Screen
// import CourierHomeScreen from '../screens/courier/CourierHomeScreen';

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

        {/* Consumer Screen */}
        <Stack.Screen name="ConsumerHome" component={ConsumerHomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        {/* Optional Courier Screen */}
        {/* <Stack.Screen name="CourierHome" component={CourierHomeScreen} /> */}

        {/* Optional Old Home Screen */}
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
