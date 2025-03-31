// src/navigation/RootNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Onboarding / Auth Screens
import GetStartedScreen from '../screens/GetStartedScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

// Role Selection
import RoleSelectionScreen from '../screens/RoleSelectionScreen';

// Business Screens
import BusinessHomeScreen from '../screens/business/BusinessHomeScreen';
import AddItemScreen from '../screens/business/AddItemScreen';
import ManageOrderScreen from '../screens/business/ManageOrderScreen'; // ✅ Singular, matches file + export

// Consumer Screen
import ConsumerHomeScreen from '../screens/consumer/ConsumerHomeScreen';

// (Optional) Courier Screen
// import CourierHomeScreen from '../screens/courier/CourierHomeScreen';

import { useAppSelector } from '../store';

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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Role Selection */}
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

        {/* Business Screens */}
        <Stack.Screen name="BusinessHome" component={BusinessHomeScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        <Stack.Screen name="ManageOrders" component={ManageOrderScreen} /> 

        {/* Consumer Screen */}
        <Stack.Screen name="ConsumerHome" component={ConsumerHomeScreen} />

        {/* Optional Courier Screen */}
        {/* <Stack.Screen name="CourierHome" component={CourierHomeScreen} /> */}

        {/* Optional Old Home Screen */}
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
