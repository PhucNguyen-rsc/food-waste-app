import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/themed';
import { BusinessStackParamList } from './types';

// Import screens
import BusinessHomeScreen from '@/screens/business/BusinessHomeScreen';
import AnalyticsScreen from '@/screens/business/AnalyticsScreen';
import InventoryScreen from '@/screens/business/InventoryScreen';
import ManageOrderScreen from '@/screens/business/ManageOrderScreen';
import BusinessProfileScreen from '@/screens/business/BusinessProfileScreen';
import AddItemScreen from '@/screens/business/AddItemScreen';
import UpdatePriceScreen from '@/screens/business/UpdatePriceScreen';

const Tab = createBottomTabNavigator<BusinessStackParamList>();
const Stack = createNativeStackNavigator<BusinessStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'BusinessHome':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Inventory':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'ManageOrders':
              iconName = focused ? 'shopping-cart' : 'shopping-cart-outline';
              break;
            case 'BusinessProfile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Icon name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="BusinessHome" 
        component={BusinessHomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Inventory" 
        component={InventoryScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="ManageOrders" 
        component={ManageOrderScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="BusinessProfile" 
        component={BusinessProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default function BusinessNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BusinessTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{ title: 'Add New Item' }}
      />
      <Stack.Screen
        name="UpdatePrice"
        component={UpdatePriceScreen}
        options={{ title: 'Update Price' }}
      />
    </Stack.Navigator>
  );
} 