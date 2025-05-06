import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/themed';
import { ConsumerStackParamList } from './types';
import { useAppSelector } from '@/store';
import { useNavigation, useRoute } from '@react-navigation/native';

// Import screens
import HomeScreen from '@/screens/consumer/ConsumerHomeScreen';
import CartScreen from '@/screens/consumer/CartScreen';
import OrdersScreen from '@/screens/consumer/OrdersScreen';
import OrderSuccessScreen from '@/screens/consumer/OrderSuccessScreen';
import ProfileScreen from '@/screens/consumer/ProfileScreen';
import OrderDetailsScreen from '@/screens/consumer/OrderDetailScreen';
import BusinessDetailsScreen from '@/screens/consumer/BusinessDetailsScreen';
import ProductDetailScreen from '@/screens/consumer/ProductDetailScreen';
import CheckoutScreen from '@/screens/consumer/CheckoutScreen';
// Payment Screens
import NoPaymentMethodScreen from '@/screens/consumer/NoPaymentMethodScreen';
import PaymentMethodsScreen from '@/screens/consumer/PaymentMethodsScreen';
import AddPaymentMethodScreen from '@/screens/consumer/AddPaymentMethodScreen';
import PaymentSuccessScreen from '@/screens/consumer/PaymentSuccessScreen';

const Tab = createBottomTabNavigator<ConsumerStackParamList>();
const Stack = createNativeStackNavigator<ConsumerStackParamList>();

function TabNavigator() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const user = useAppSelector((state) => state.auth.user);
  const isProfileComplete = Boolean(user?.name && user?.deliveryAddress);
  const hasRedirectedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isProfileComplete && route.name !== 'Profile' && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      navigation.navigate('Profile');
    }
  }, [isProfileComplete, route.name]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Orders':
              iconName = focused ? 'file-document' : 'file-document-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Icon name={iconName} type="material-community" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function ConsumerNavigator() {
  return (
    <Stack.Navigator initialRouteName="ConsumerTabs">
      <Stack.Screen
        name="ConsumerTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ 
          title: 'Order Details',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetailsScreen}
        options={{ 
          title: 'Business Details',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ 
          title: 'Product Details',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="CheckoutScreen"
        component={CheckoutScreen}
        options={{ 
          title: 'Checkout',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="OrderSuccessScreen"
        component={OrderSuccessScreen}
        options={{ 
          title: 'Order Success',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      {/* Payment Screens */}
      <Stack.Screen
        name="NoPaymentMethod"
        component={NoPaymentMethodScreen}
        options={{
          title: 'Payment Method',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{
          title: 'Payment Methods',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="AddPaymentMethod"
        component={AddPaymentMethodScreen}
        options={{
          title: 'Add Payment Method',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{
          title: 'Success',
          headerShown: true,
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
} 