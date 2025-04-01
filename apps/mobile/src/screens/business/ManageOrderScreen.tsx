// src/screens/business/ManageOrderScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import BusinessLayout from '@/components/BusinessLayout';

type Order = {
  id: string;
  customerName: string;
  totalPrice: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
};

export default function ManageOrderScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // TODO: fetch orders from your backend. For now, mock data:
    setOrders([
      { id: 'ORD123', customerName: 'John White', totalPrice: 39.5, status: 'PENDING' },
      { id: 'ORD124', customerName: 'Sarah Ahmed', totalPrice: 15, status: 'PENDING' },
    ]);
  }, []);

  const handleAccept = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'ACCEPTED' } : o))
    );
  };

  const handleReject = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'REJECTED' } : o))
    );
  };

  const handleComplete = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'COMPLETED' } : o))
    );
  };

  const renderOrder = ({ item }: { item: Order }) => {
    let statusStyle = styles.statusDefault;
    if (item.status === 'ACCEPTED') statusStyle = styles.statusAccepted;
    else if (item.status === 'REJECTED') statusStyle = styles.statusRejected;
    else if (item.status === 'COMPLETED') statusStyle = styles.statusCompleted;

    return (
      <View style={styles.orderCard}>
        <Text style={styles.orderTitle}>Order #{item.id}</Text>
        <Text style={styles.orderDetails}>Customer: {item.customerName}</Text>
        <Text style={styles.orderDetails}>AED {item.totalPrice.toFixed(2)}</Text>
        <View style={[styles.statusContainer, statusStyle]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>

        {item.status === 'PENDING' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(item.id)}>
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'ACCEPTED' && (
          <TouchableOpacity style={styles.completeBtn} onPress={() => handleComplete(item.id)}>
            <Text style={styles.btnText}>Mark as Completed</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <BusinessLayout>
      <Text style={styles.heading}>Manage Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContainer}
      />
    </BusinessLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  listContainer: {
    paddingVertical: 8,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDetails: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusDefault: {
    backgroundColor: '#EEE',
  },
  statusAccepted: {
    backgroundColor: '#22C55E',
  },
  statusRejected: {
    backgroundColor: '#FF5C5C',
  },
  statusCompleted: {
    backgroundColor: '#007AFF',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  acceptBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  rejectBtn: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  completeBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  btnText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
