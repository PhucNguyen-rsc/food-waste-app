import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Order } from '@/store/slices/ordersSlice';

interface ManageOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: Order['status']) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '#F59E0B';
    case 'CONFIRMED':
      return '#3B82F6';
    case 'PREPARING':
      return '#8B5CF6';
    case 'READY':
      return '#10B981';
    case 'PICKED_UP':
      return '#6366F1';
    case 'DELIVERED':
      return '#22C55E';
    case 'CANCELLED':
      return '#EF4444';
    default:
      return '#666';
  }
};

const getNextStatus = (currentStatus: Order['status']): Order['status'] => {
  switch (currentStatus) {
    case 'PENDING':
      return 'CONFIRMED';
    case 'CONFIRMED':
      return 'PREPARING';
    case 'PREPARING':
      return 'READY';
    case 'READY':
      return 'PICKED_UP';
    case 'PICKED_UP':
      return 'DELIVERED';
    default:
      return currentStatus;
  }
};

const getStatusButtonText = (currentStatus: string) => {
  switch (currentStatus) {
    case 'PENDING':
      return 'Confirm Order';
    case 'CONFIRMED':
      return 'Start Preparing';
    case 'PREPARING':
      return 'Mark as Ready';
    case 'READY':
      return 'Mark as Picked Up';
    case 'PICKED_UP':
      return 'Mark as Delivered';
    default:
      return 'Update Status';
  }
};

export default function ManageOrderCard({ order, onUpdateStatus }: ManageOrderCardProps) {
  const canUpdateStatus = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';
  const nextStatus = getNextStatus(order.status);
  const buttonText = getStatusButtonText(order.status);

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{order.id.slice(-6)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.orderContent}>
        <View style={styles.itemsContainer}>
          <Ionicons name="fast-food-outline" size={16} color="#666" />
          <Text style={styles.itemsText} numberOfLines={1}>
            {order.items.map(i => `${i.quantity}x ${i.foodItem.name}`).join(', ')}
          </Text>
        </View>

        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.addressText} numberOfLines={1}>
            {order.deliveryAddress}
          </Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.date}>
          {new Date(order.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.total}>AED {order.totalAmount.toFixed(2)}</Text>
      </View>

      {canUpdateStatus && (
        <TouchableOpacity 
          style={[styles.updateButton, { backgroundColor: getStatusColor(nextStatus) }]}
          onPress={() => onUpdateStatus(order.id, nextStatus)}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  orderContent: {
    marginBottom: 12,
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemsText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  updateButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 