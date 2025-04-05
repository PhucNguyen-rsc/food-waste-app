// src/screens/business/BusinessHomeScreen.tsx

import React, { useState, useEffect } from 'react';
import { 
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import BusinessLayout from '@/components/BusinessLayout'; // Use your BusinessLayout for a bottom bar
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/store';
import FoodItemCard from '@/components/FoodItemCard';
import { FoodItem } from '@/store/slices/foodItemsSlice';

/** Types for dummy data */
type Listing = {
  id: string;
  name: string;
  quantityLeft: number;
  expiresIn: string;      // e.g. "Expires today" or "Expires in 2d"
  price: number;
  pricingType: 'Dynamic' | 'Fixed';
  imageUrl?: string;
};

type Order = {
  id: string;
  items: string;          // e.g. "2x Veggie Sandwich, 1x Salad"
  totalPrice: number;
  status: 'Delivered' | 'In Progress' | 'Pending';
};

type QuickAction = {
  title: 'Add Item' | 'Update Price' | 'Inventory';
  icon: 'add-circle' | 'pricetag' | 'cube';
  screen: 'AddItem' | 'UpdatePrice' | 'Inventory';
};

export default function BusinessHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppSelector((state) => state.auth.user);
  const foodItems = useAppSelector((state) => state.foodItems?.items) || [];
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch from your backend.
    // For now, we mock data:
    setListings([
      {
        id: 'list1',
        name: 'Veggie Sandwich',
        quantityLeft: 12,
        expiresIn: 'Expires today',
        price: 15,
        pricingType: 'Dynamic',
        imageUrl: 'https://placehold.co/100x100',
      },
      {
        id: 'list2',
        name: 'Fruit Salad Bowl',
        quantityLeft: 8,
        expiresIn: 'Expires in 2d',
        price: 12,
        pricingType: 'Fixed',
      },
    ]);

    setOrders([
      {
        id: 'ORD2841',
        items: '2x Veggie Sandwich\n1x Fruit Salad Bowl',
        totalPrice: 42,
        status: 'Delivered',
      },
      {
        id: 'ORD2840',
        items: '3x Fruit Salad Bowl',
        totalPrice: 36,
        status: 'In Progress',
      },
    ]);
  }, []);

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
      <View style={styles.container}>
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

          {availableItems.length > 0 ? (
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
      </View>
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
});
