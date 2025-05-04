import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Icon } from '@rneui/themed';

interface OrderItem {
  id: string;
  foodItem: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface OrderCardProps {
  id: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
  onPress?: () => void;
}

export default function OrderCard({
  id,
  status,
  totalAmount,
  deliveryAddress,
  createdAt,
  items,
  onPress,
}: OrderCardProps) {
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

  const formatItems = (items: OrderItem[]) => {
    return items.map(item => `${item.quantity}x ${item.foodItem.name}`).join(', ');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order #{id.slice(-6)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.itemsContainer}>
          <Icon name="fast-food-outline" size={16} color="#666" />
          <Text style={styles.itemsText} numberOfLines={1}>
            {formatItems(items)}
          </Text>
        </View>

        <View style={styles.addressContainer}>
          <Icon name="location-outline" size={16} color="#666" />
          <Text style={styles.addressText} numberOfLines={1}>
            {deliveryAddress}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>
          {format(new Date(createdAt), 'MMM dd, yyyy HH:mm')}
        </Text>
        <Text style={styles.total}>AED {totalAmount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
  header: {
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
  content: {
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
  footer: {
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
}); 