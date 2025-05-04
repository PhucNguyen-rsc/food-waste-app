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

// Navigators
import ConsumerNavigator from './ConsumerNavigator';
import BusinessNavigator from './BusinessNavigator';

// Courier Screens
import CourierHomeScreen from '@/screens/courier/CourierHomeScreen';
import ActiveDeliveryScreen from '@/screens/courier/ActiveDeliveryScreen';
import DeliveryDetailsScreen from '@/screens/courier/DeliveryDetailsScreen';
import EarningsScreen from '@/screens/courier/EarningsScreen';
import HistoryScreen from '@/screens/courier/HistoryScreen';
import CourierProfileScreen from '@/screens/courier/CourierProfileScreen';

// Payment Screens
import NoPaymentMethodScreen from '@/screens/consumer/NoPaymentMethodScreen';
import PaymentMethodsScreen from '@/screens/consumer/PaymentMethodsScreen';
import AddPaymentMethodScreen from '@/screens/consumer/AddPaymentMethodScreen';
import PaymentSuccessScreen from '@/screens/consumer/PaymentSuccessScreen';

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

        {/* Business Navigator */}
        <Stack.Screen name="Business" component={BusinessNavigator} />

        {/* Consumer Navigator */}
        <Stack.Screen name="Consumer" component={ConsumerNavigator} />

        {/* Courier Screens */}
        <Stack.Screen name="CourierHome" component={CourierHomeScreen} />
        <Stack.Screen name="ActiveDelivery" component={ActiveDeliveryScreen} />
        <Stack.Screen name="DeliveryDetails" component={DeliveryDetailsScreen} />
        <Stack.Screen name="Earnings" component={EarningsScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="CourierProfile" component={CourierProfileScreen} />

        {/* Payment Screens */}
        <Stack.Screen
          name="NoPaymentMethod"
          component={NoPaymentMethodScreen}
          options={{
            title: 'Payment Method',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="PaymentMethods"
          component={PaymentMethodsScreen}
          options={{
            title: 'Payment Methods',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="AddPaymentMethod"
          component={AddPaymentMethodScreen}
          options={{
            title: 'Add Payment Method',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccessScreen}
          options={{
            title: 'Success',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
