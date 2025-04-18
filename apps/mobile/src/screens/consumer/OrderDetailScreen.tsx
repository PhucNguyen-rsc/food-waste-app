import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ConsumerLayout from '@/components/ConsumerLayout';
import { Order } from '@/store/slices/ordersSlice';

export default function OrderDetailScreen() {
  const route = useRoute();
  const { order } = route.params as { order: Order };

  const renderItem = ({ item }: { item: Order['items'][0] }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.foodItem.name}</Text>
      <Text style={styles.itemDetails}>
        {item.quantity} x AED {item.price}
      </Text>
    </View>
  );

  return (
    <ConsumerLayout title="Order Details">
      <View style={styles.container}>
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{order.status}</Text>
          <Text style={styles.date}>
            Ordered on {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          <FlatList
            data={order.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>AED {order.totalAmount}</Text>
        </View>
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  statusContainer: {
    marginBottom: 24,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22C55E',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C55E',
  },
}); 