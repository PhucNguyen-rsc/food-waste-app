// src/screens/business/ManageOrderScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import BusinessLayout from '@/components/BusinessLayout';
import { useAppSelector, useAppDispatch } from '@/store';
import { setOrders, setLoading, setError } from '@/store/slices/ordersSlice';
import api from '@/lib/api';
import ManageOrderCard from '@/components/ManageOrderCard';
import { Order } from '@/store/slices/ordersSlice';
import { Ionicons } from '@expo/vector-icons';

export default function ManageOrderScreen() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.items) || [];
  const loading = useAppSelector((state) => state.orders.loading);
  const error = useAppSelector((state) => state.orders.error);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch(setLoading(true));
        const { data } = await api.get('/business/orders');
        dispatch(setOrders(data));
      } catch (error) {
        dispatch(setError('Failed to fetch orders'));
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [dispatch]);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await api.patch(`/business/orders/${orderId}/status`, { status: newStatus });
      dispatch(setOrders(
        orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return (
      <BusinessLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </BusinessLayout>
    );
  }

  if (error) {
    return (
      <BusinessLayout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </BusinessLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <BusinessLayout>
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            When customers place orders, they will appear here
          </Text>
        </View>
      </BusinessLayout>
    );
  }

  return (
    <BusinessLayout>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <ManageOrderCard
            order={item}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </BusinessLayout>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  listContainer: {
    padding: 16,
  },
});
