import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_ENDPOINTS, handleApiError } from '@/config/api';
import api from '@/lib/api';
import { OrderStatus } from '@food-waste/types';
import { format } from 'date-fns';
import ConsumerLayout from '@/components/ConsumerLayout';

type Order = {
  id: string;
  status: OrderStatus;
  businessName: string;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
};

export default function OrdersScreen() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    // Poll every 30 seconds to check for updates
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CONSUMER.ORDERS);
      const orders = response.data;

      // Split orders into active and completed
      const active = orders.filter(
        (o: Order) => 
          o.status !== OrderStatus.DELIVERED && 
          o.status !== OrderStatus.CANCELLED
      );
      const completed = orders.filter(
        (o: Order) => 
          o.status === OrderStatus.DELIVERED || 
          o.status === OrderStatus.CANCELLED
      );

      setActiveOrders(active);
      setCompletedOrders(completed);
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async (orderId: string) => {
    try {
      await api.put(API_ENDPOINTS.CONSUMER.CONFIRM_DELIVERY(orderId));
      
      Alert.alert(
        'Delivery Confirmed',
        'Thank you for confirming your delivery!',
        [{ text: 'OK' }]
      );
      
      // Refresh the orders list
      fetchOrders();
    } catch (err) {
      const apiError = handleApiError(err);
      Alert.alert('Error', apiError.message);
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Pending';
      case OrderStatus.BUSINESS_CONFIRMED:
        return 'Confirmed by Business';
      case OrderStatus.CONFIRMED:
        return 'Courier Assigned';
      case OrderStatus.PREPARING:
        return 'Preparing';
      case OrderStatus.READY:
        return 'Ready for Pickup';
      case OrderStatus.PICKED_UP:
        return 'Out for Delivery';
      case OrderStatus.COURIER_DELIVERED:
        return 'Pending Confirmation';
      case OrderStatus.DELIVERED:
        return 'Delivered';
      case OrderStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.businessName}>{item.businessName}</Text>
          <Text style={styles.orderDate}>
            {format(new Date(item.createdAt), 'MMM d, yyyy h:mm a')}
          </Text>
        </View>
        <Text style={styles.amount}>AED {item.totalAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.itemsList}>
        {item.items.map((orderItem, index) => (
          <Text key={index} style={styles.itemText}>
            {orderItem.quantity}x {orderItem.name}
          </Text>
        ))}
      </View>

      <View style={styles.detailRow}>
        <Ionicons name="location" size={16} color="#6B7280" />
        <Text style={styles.detailText}>{item.deliveryAddress}</Text>
      </View>

      <View style={styles.footer}>
        <View style={[
          styles.statusBadge,
          item.status === OrderStatus.CANCELLED ? styles.cancelledBadge : 
          item.status === OrderStatus.DELIVERED ? styles.deliveredBadge :
          styles.activeBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === OrderStatus.CANCELLED ? styles.cancelledText :
            item.status === OrderStatus.DELIVERED ? styles.deliveredText :
            styles.activeText
          ]}>
            {getStatusText(item.status)}
          </Text>
        </View>

        {/* Show confirm button only for COURIER_DELIVERED status */}
        {item.status === OrderStatus.COURIER_DELIVERED && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => confirmDelivery(item.id)}
          >
            <Text style={styles.confirmButtonText}>Confirm Receipt</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <ConsumerLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </ConsumerLayout>
    );
  }

  if (error) {
    return (
      <ConsumerLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ConsumerLayout>
    );
  }

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        {/* Active Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          <FlatList
            data={activeOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No active orders</Text>
            }
          />
        </View>

        {/* Completed Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Orders</Text>
          <FlatList
            data={completedOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No completed orders</Text>
            }
          />
        </View>
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
  },
  itemsList: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#FEF3C7',
  },
  deliveredBadge: {
    backgroundColor: '#D1FAE5',
  },
  cancelledBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeText: {
    color: '#92400E',
  },
  deliveredText: {
    color: '#065F46',
  },
  cancelledText: {
    color: '#991B1B',
  },
  confirmButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
