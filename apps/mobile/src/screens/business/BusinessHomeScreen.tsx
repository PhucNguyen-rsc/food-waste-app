// src/screens/business/BusinessHomeScreen.tsx

import React, { useState, useEffect } from 'react';
import { 
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import BusinessLayout from '@/components/BusinessLayout'; // Use your BusinessLayout for a bottom bar
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { setOrders, setLoading as setOrdersLoading, setError as setOrdersError } from '@/store/slices/ordersSlice';
import { setFoodItems, setLoading as setFoodItemsLoading, setError as setFoodItemsError } from '@/store/slices/foodItemsSlice';
import FoodItemCard from '@/components/FoodItemCard';
import OrderCard from '@/components/OrderCard';
import { FoodItem } from '@/store/slices/foodItemsSlice';
import api from '@/lib/api';

type QuickAction = {
  title: 'Add Item' | 'Update Price' | 'Inventory';
  icon: 'add-circle' | 'pricetag' | 'cube';
  screen: 'AddItem' | 'UpdatePrice' | 'Inventory';
};

export default function BusinessHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const foodItems = useAppSelector((state) => state.foodItems?.items) || [];
  const foodItemsLoading = useAppSelector((state) => state.foodItems?.loading);
  const foodItemsError = useAppSelector((state) => state.foodItems?.error);
  const orders = useAppSelector((state) => state.orders.items) || [];
  const ordersLoading = useAppSelector((state) => state.orders.loading);
  const ordersError = useAppSelector((state) => state.orders.error);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch food items
        dispatch(setFoodItemsLoading(true));
        const { data: foodItemsData } = await api.get('/business/food-items');
        dispatch(setFoodItems(foodItemsData));

        // Fetch orders
        dispatch(setOrdersLoading(true));
        const { data: ordersData } = await api.get('/business/orders');
        dispatch(setOrders(ordersData));
      } catch (error) {
        console.error('Error fetching data:', error);
        dispatch(setFoodItemsError('Failed to fetch food items'));
        dispatch(setOrdersError('Failed to fetch orders'));
      }
    };

    fetchData();
  }, [dispatch]);

  // Get only available items, sorted by creation date
  const availableItems = foodItems
    .filter((item: FoodItem) => item.status === 'AVAILABLE')
    .sort((a: FoodItem, b: FoodItem) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 2); // Only take the first 2 items

  const quickActions: QuickAction[] = [
    {
      title: 'Add Item',
      icon: 'add-circle',
      screen: 'AddItem',
    },
    {
      title: 'Update Price',
      icon: 'pricetag',
      screen: 'UpdatePrice',
    },
    {
      title: 'Inventory',
      icon: 'cube',
      screen: 'Inventory',
    },
  ];

  return (
    <BusinessLayout title={user?.businessName || 'Your Business'}>
      <ScrollView style={styles.container}>
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.title}
              style={styles.actionCard}
              onPress={() => {
                if (action.screen === 'UpdatePrice') {
                  navigation.navigate('UpdatePrice', { itemId: '' });
                } else {
                  navigation.navigate(action.screen);
                }
              }}
            >
              <Ionicons name={action.icon} size={24} color="#22C55E" />
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Listings</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('Inventory')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#22C55E" />
            </TouchableOpacity>
          </View>

          {foodItemsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#22C55E" />
            </View>
          ) : foodItemsError ? (
            <View style={styles.emptyState}>
              <Text style={styles.errorText}>{foodItemsError}</Text>
            </View>
          ) : availableItems.length > 0 ? (
            availableItems.map((item: FoodItem) => (
              <FoodItemCard
                key={item.id}
                {...item}
                onPress={() => navigation.navigate('UpdatePrice', { itemId: item.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No active listings</Text>
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => navigation.navigate('AddItem')}
              >
                <Text style={styles.addItemButtonText}>Add Your First Item</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigation.navigate('ManageOrders')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#22C55E" />
            </TouchableOpacity>
          </View>

          {ordersLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#22C55E" />
            </View>
          ) : ordersError ? (
            <View style={styles.emptyState}>
              <Text style={styles.errorText}>{ordersError}</Text>
            </View>
          ) : orders.length > 0 ? (
            orders.slice(0, 2).map((order) => (
              <OrderCard
                key={order.id}
                {...order}
                onPress={() => navigation.navigate('ManageOrders')}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent orders</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </BusinessLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  addItemButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addItemButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
});
