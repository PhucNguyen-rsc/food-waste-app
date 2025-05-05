import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/themed';
import { CourierStackParamList } from './types';
import { useAppSelector } from '@/store';
import { useNavigation, useRoute } from '@react-navigation/native';

// Import screens
import CourierHomeScreen from '@/screens/courier/CourierHomeScreen';
import ActiveDeliveryScreen from '@/screens/courier/ActiveDeliveryScreen';
import DeliveryDetailsScreen from '@/screens/courier/DeliveryDetailsScreen';
import EarningsScreen from '@/screens/courier/EarningsScreen';
import HistoryScreen from '@/screens/courier/HistoryScreen';
import CourierProfileScreen from '@/screens/courier/CourierProfileScreen';

const Tab = createBottomTabNavigator<CourierStackParamList>();
const Stack = createNativeStackNavigator<CourierStackParamList>();

function TabNavigator() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const user = useAppSelector((state) => state.auth.user);
  const isProfileComplete = Boolean(user?.name);
  const hasRedirectedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isProfileComplete && route.name !== 'CourierProfile' && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      navigation.navigate('CourierProfile');
    }
  }, [isProfileComplete, route.name]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'CourierHome':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'ActiveDelivery':
              iconName = focused ? 'truck-fast' : 'truck-fast-outline';
              break;
            case 'Earnings':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'History':
              iconName = focused ? 'clock-time-four' : 'clock-time-four-outline';
              break;
            case 'CourierProfile':
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
        name="CourierHome" 
        component={CourierHomeScreen}
        options={{ 
          headerShown: false,
          title: 'Home'
        }}
      />
      <Tab.Screen 
        name="ActiveDelivery" 
        component={ActiveDeliveryScreen}
        options={{ 
          headerShown: false,
          title: 'Active'
        }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen}
        options={{ 
          headerShown: false,
          title: 'Earnings'
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{ 
          headerShown: false,
          title: 'History'
        }}
      />
      <Tab.Screen 
        name="CourierProfile" 
        component={CourierProfileScreen}
        options={{ 
          headerShown: false,
          title: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
}

export default function CourierNavigator() {
  return (
    <Stack.Navigator initialRouteName="CourierTabs">
      <Stack.Screen
        name="CourierTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveryDetails"
        component={DeliveryDetailsScreen}
        options={{ 
          title: 'Delivery Details',
          headerShown: true,
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
} 