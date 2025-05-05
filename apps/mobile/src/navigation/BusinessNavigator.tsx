import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '@rneui/themed';
import { BusinessStackParamList } from './types';
import { useAppSelector } from '@/store';
import { useNavigation, useRoute } from '@react-navigation/native';
// Import screens
import BusinessHomeScreen from '@/screens/business/BusinessHomeScreen';
import AnalyticsScreen from '@/screens/business/AnalyticsScreen';
import InventoryScreen from '@/screens/business/InventoryScreen';
import ManageOrderScreen from '@/screens/business/ManageOrderScreen';
import BusinessProfileScreen from '@/screens/business/BusinessProfileScreen';
import AddItemScreen from '@/screens/business/AddItemScreen';
import EditItemScreen from '@/screens/business/EditItemScreen';


const Tab = createBottomTabNavigator<BusinessStackParamList>();
const Stack = createNativeStackNavigator<BusinessStackParamList>();

function TabNavigator() {
  const navigation = useNavigation<any>(); // type it better if needed
  const route = useRoute();
  const user = useAppSelector((state) => state.auth.user);
  const isProfileComplete = Boolean(user?.businessName && user?.businessAddress && user?.businessPhone);
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
            case 'Orders':
              iconName = focused ? 'file-document' : 'file-document-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'chart-bar' : 'chart-bar-stacked';
              break;
            case 'Inventory':
              iconName = focused ? 'cube' : 'cube-outline';
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
      <Tab.Screen name="Home" component={BusinessHomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Orders" component={ManageOrderScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Inventory" component={InventoryScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={BusinessProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}


export default function BusinessNavigator() {
  return (
    <Stack.Navigator initialRouteName="BusinessTabs">
      <Stack.Screen
        name="BusinessTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{ 
          title: 'Add New Item',
          headerShown: true,
          presentation: 'modal'
        }}
      />
      <Stack.Screen
        name="EditItem"
        component={EditItemScreen}
        options={{ 
          title: 'Edit Item',
          headerShown: true,
          presentation: 'modal'
        }}
      />
    </Stack.Navigator>
  );
}
