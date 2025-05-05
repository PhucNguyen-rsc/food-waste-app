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
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'chart-bar' : 'chart-bar-stacked';
              break;
            case 'Inventory':
              iconName = focused ? 'format-list-bulleted' : 'format-list-bulleted';
              break;
            case 'Orders':
              iconName = focused ? 'package-variant' : 'package-variant-closed';
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
        name="Orders" 
        component={ManageOrderScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
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