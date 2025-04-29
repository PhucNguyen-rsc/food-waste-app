import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import CourierLayout from '@/components/CourierLayout';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppSelector } from '@/store';
import api from '@/lib/api';
import { courierDB } from '@/lib/db';
import { Order } from '@food-waste/database';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type DailyStats = {
  completed_deliveries: number;
  total_earnings: number;
  average_rating: number;
};

export default function CourierHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAppSelector((state) => state.auth.user);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    completed_deliveries: 0,
    total_earnings: 0,
    average_rating: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [deliveries, setDeliveries] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDailyStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get('/users/courier/stats', {
        params: { date: today }
      });
      setDailyStats(response.data);
    } catch (error) {
      console.error('Error fetching daily stats:', error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const availableDeliveries = await courierDB.getAvailableDeliveries();
      setDeliveries(availableDeliveries);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDailyStats(), fetchDeliveries()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDailyStats();
    fetchDeliveries();
  }, [user?.id]);

  const handleAcceptDelivery = async (orderId: string) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await courierDB.acceptDelivery(orderId, user.id);
      await fetchDeliveries();
    } catch (error) {
      console.error('Error accepting delivery:', error);
      Alert.alert('Error', 'Failed to accept delivery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDeliveryItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.businessName}>Order #{item.id.slice(0, 8)}</Text>
        <Text style={styles.amount}>₹{item.totalAmount}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.address}>Delivery to: {item.deliveryAddress}</Text>
      </View>
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[styles.acceptButton, loading && styles.acceptButtonDisabled]}
          onPress={() => handleAcceptDelivery(item.id)}
          disabled={loading}
        >
          <Text style={styles.acceptButtonText}>
            {loading ? 'Accepting...' : 'Accept Delivery'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <CourierLayout title="Available Deliveries">
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.statsCard}
          onPress={() => navigation.navigate('DeliveriesHistory')}
        >
          <Text style={styles.statsTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dailyStats.completed_deliveries}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>AED {dailyStats.total_earnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dailyStats.average_rating}★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </TouchableOpacity>

        <FlatList
          data={deliveries}
          renderItem={renderDeliveryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FontAwesome5 name="inbox" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No delivery requests available</Text>
            </View>
          }
        />
      </View>
    </CourierLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  statsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
  },
  cardBody: {
    gap: 8,
    marginBottom: 16,
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  acceptButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptButtonDisabled: {
    backgroundColor: '#ccc',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
}); 