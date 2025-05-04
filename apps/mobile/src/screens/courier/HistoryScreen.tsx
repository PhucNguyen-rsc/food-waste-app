// apps/mobile/src/screens/courier/HistoryScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import CourierLayout from '@/components/CourierLayout';
import { Icon } from '@rneui/themed';
import { API_ENDPOINTS } from '@/config/api';
import api from '@/lib/api';
import { OrderStatus } from '@food-waste/types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourierStackParamList } from '@/navigation/types';
import { format } from 'date-fns';

type HistoryScreenNavigationProp = NativeStackNavigationProp<CourierStackParamList, 'History'>;

type DeliveryHistory = {
  id: string;
  orderId: string;
  status: OrderStatus;
  customerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  completedAt?: string;
  totalAmount: number;
};

export default function HistoryScreen() {
  const [deliveries, setDeliveries] = useState<DeliveryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<HistoryScreenNavigationProp>();

  const fetchHistory = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.COURIER.HISTORY);
      setDeliveries(response.data);
    } catch (error) {
      console.error('Failed to fetch delivery history:', error);
      Alert.alert('Error', 'Failed to fetch delivery history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchHistory();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const updateDeliveryStatus = async (deliveryId: string, status: OrderStatus) => {
    try {
      await api.put(API_ENDPOINTS.COURIER.UPDATE_DELIVERY_STATUS(deliveryId), {
        status,
      });
      
      // Update the local state
      setDeliveries(prevDeliveries =>
        prevDeliveries.map(delivery =>
          delivery.id === deliveryId
            ? { 
                ...delivery, 
                status,
                ...(status === OrderStatus.COURIER_DELIVERED ? { completedAt: new Date().toISOString() } : {})
              }
            : delivery
        )
      );

      // Refresh the list to ensure proper categorization
      fetchHistory();

      Alert.alert('Success', `Delivery ${status === OrderStatus.PICKED_UP ? 'picked up' : 'completed'}!`);
    } catch (error) {
      console.error('Failed to update delivery status:', error);
      Alert.alert('Error', `Failed to ${status === OrderStatus.PICKED_UP ? 'pick up' : 'complete'} delivery`);
    }
  };

  const renderActionButton = (item: DeliveryHistory) => {
    switch (item.status) {
      case OrderStatus.CONFIRMED:
        return (
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: '#3B82F6' }]}
            onPress={() => {
              Alert.alert(
                'Confirm Pickup',
                'Have you picked up this order from the business?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Confirm',
                    onPress: () => updateDeliveryStatus(item.id, OrderStatus.PICKED_UP),
                  },
                ]
              );
            }}
          >
            <Text style={styles.confirmButtonText}>Mark as Picked Up</Text>
          </TouchableOpacity>
        );
      case OrderStatus.PICKED_UP:
        return (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              Alert.alert(
                'Confirm Delivery',
                'Have you delivered this order to the customer?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Confirm',
                    onPress: () => updateDeliveryStatus(item.id, OrderStatus.COURIER_DELIVERED),
                  },
                ]
              );
            }}
          >
            <Text style={styles.confirmButtonText}>Mark as Delivered</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const renderDeliveryItem = ({ item }: { item: DeliveryHistory }) => (
    <View style={styles.deliveryItem}>
      <View style={styles.header}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.earnings}>AED {(item.totalAmount * 0.2).toFixed(2)}</Text>
      </View>
      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <Icon name="map-marker" type="material-community" size={16} color="#6B7280" />
          <Text style={styles.address}>Pickup: {item.pickupAddress}</Text>
        </View>
        <View style={styles.addressRow}>
          <Icon name="flag-checkered" type="material-community" size={16} color="#6B7280" />
          <Text style={styles.address}>Delivery: {item.deliveryAddress}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.date}>
          {item.completedAt 
            ? format(new Date(item.completedAt), 'MMM d, yyyy h:mm a')
            : 'In Progress'}
        </Text>
        {renderActionButton(item)}
        <View style={[
          styles.statusBadge,
          item.status === OrderStatus.DELIVERED || item.status === OrderStatus.COURIER_DELIVERED
            ? styles.completedBadge 
            : styles.activeBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === OrderStatus.DELIVERED || item.status === OrderStatus.COURIER_DELIVERED
              ? styles.completedText 
              : styles.activeText
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  const activeDeliveries = deliveries.filter(
    delivery => ![OrderStatus.DELIVERED, OrderStatus.COURIER_DELIVERED].includes(delivery.status)
  );

  const completedDeliveries = deliveries.filter(
    delivery => [OrderStatus.DELIVERED, OrderStatus.COURIER_DELIVERED].includes(delivery.status)
  );

  if (loading && !refreshing) {
    return (
      <CourierLayout title="History">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </CourierLayout>
    );
  }

  return (
    <CourierLayout title="History">
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        stickyHeaderIndices={[0, 2]} // Make both section headers sticky
      >
        {/* Active Deliveries Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Deliveries</Text>
        </View>
        
        <View style={styles.sectionContent}>
          {activeDeliveries.length > 0 ? (
            activeDeliveries.map(item => (
              <View key={item.id} style={styles.deliveryItemContainer}>
                {renderDeliveryItem({ item })}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active deliveries</Text>
            </View>
          )}
        </View>

        {/* Completed Deliveries Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Completed Deliveries</Text>
        </View>

        <View style={styles.sectionContent}>
          {completedDeliveries.length > 0 ? (
            completedDeliveries.map(item => (
              <View key={item.id} style={styles.deliveryItemContainer}>
                {renderDeliveryItem({ item })}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No completed deliveries yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </CourierLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deliveryItemContainer: {
    marginBottom: 12,
  },
  deliveryItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  earnings: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
  },
  addressContainer: {
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#FEF3C7',
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeText: {
    color: '#92400E',
  },
  completedText: {
    color: '#065F46',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  confirmButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
