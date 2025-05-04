import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/themed';
import { ConsumerStackParamList } from './types';

// Import screens
import HomeScreen from '@/screens/consumer/ConsumerHomeScreen';
import CartScreen from '@/screens/consumer/CartScreen';
import OrdersScreen from '@/screens/consumer/OrdersScreen';
import ProfileScreen from '@/screens/consumer/ProfileScreen';
import OrderDetailsScreen from '@/screens/consumer/OrderDetailScreen';
import BusinessDetailsScreen from '@/screens/consumer/BusinessDetailsScreen';
import ProductDetailScreen from '@/screens/consumer/ProductDetailScreen';
import CheckoutScreen from '@/screens/consumer/CheckoutScreen';

const Tab = createBottomTabNavigator<ConsumerStackParamList>();
const Stack = createNativeStackNavigator<ConsumerStackParamList>();

function TabNavigator() {
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
              iconName = focused ? 'format-list-bulleted' : 'format-list-bulleted';
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
    <Stack.Navigator>
      <Stack.Screen
        name="ConsumerTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: 'Order Details' }}
      />
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetailsScreen}
        options={{ title: 'Business Details' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen
        name="CheckoutScreen"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
    </Stack.Navigator>
  );
} 