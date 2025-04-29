import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ConsumerStackParamList } from './types';

// Import screens
import HomeScreen from '@/screens/consumer/HomeScreen';
import CartScreen from '@/screens/consumer/CartScreen';
import OrdersScreen from '@/screens/consumer/OrdersScreen';
import ProfileScreen from '@/screens/consumer/ProfileScreen';
import OrderDetailsScreen from '@/screens/consumer/OrderDetailsScreen';
import BusinessDetailsScreen from '@/screens/consumer/BusinessDetailsScreen';

const Tab = createBottomTabNavigator<ConsumerStackParamList>();
const Stack = createNativeStackNavigator<ConsumerStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Cart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'Orders':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
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
    </Stack.Navigator>
  );
} 