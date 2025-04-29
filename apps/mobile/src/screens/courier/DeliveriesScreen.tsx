import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import CourierLayout from '@/components/CourierLayout';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppSelector } from '@/store';
import api from '@/lib/api';
import { format } from 'date-fns';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Delivery = {
  id: string;
  business_name: string;
  pickup_address: string;
  delivery_address: string;
  amount: number;
  status: 'completed' | 'cancelled';
  completed_at: string;
  rating?: number;
};

type TimeFilter = 'day' | 'week' | 'month' | 'all';

type Stats = {
  total_deliveries: number;
  total_earnings: number;
  average_rating: number;
};

export default function DeliveriesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAppSelector((state) => state.auth.user);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('day');
  const [stats, setStats] = useState<Stats>({
    total_deliveries: 0,
    total_earnings: 0,
    average_rating: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchDeliveries = async () => {
    try {
      const response = await api.get('/users/courier/deliveries/history', {
        params: { timeFilter }
      });
      
      setDeliveries(response.data.deliveries);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      Alert.alert('Error', 'Failed to load delivery history. Please try again.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDeliveries();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDeliveries();
  }, [timeFilter, user?.id]);

  const renderDelivery = ({ item }: { item: Delivery }) => (
    <View style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <Text style={styles.businessName}>{item.business_name}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'completed' ? '#e8f5e9' : '#ffebee',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === 'completed' ? '#2e7d32' : '#c62828',
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.addressSection}>
        <View style={styles.addressRow}>
          <FontAwesome5 name="store" size={16} color="#666" />
          <Text style={styles.address}>{item.pickup_address}</Text>
        </View>
        <View style={styles.addressRow}>
          <FontAwesome5 name="map-marker-alt" size={16} color="#666" />
          <Text style={styles.address}>{item.delivery_address}</Text>
        </View>
      </View>

      <View style={styles.deliveryFooter}>
        <View style={styles.footerLeft}>
          <Text style={styles.timestamp}>
            {format(new Date(item.completed_at), 'MMM d, yyyy h:mm a')}
          </Text>
          {item.rating && (
            <Text style={styles.rating}>{item.rating.toFixed(1)}★</Text>
          )}
        </View>
        <Text style={styles.amount}>AED {item.amount.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <CourierLayout title="Delivery History">
      <View style={styles.container}>
        <View style={styles.statsCard}>
          <View style={styles.filterRow}>
            <Text style={styles.statsTitle}>Statistics</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  timeFilter === 'day' && styles.activeFilter,
                ]}
                onPress={() => setTimeFilter('day')}
              >
                <Text
                  style={[
                    styles.filterText,
                    timeFilter === 'day' && styles.activeFilterText,
                  ]}
                >
                  Day
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  timeFilter === 'week' && styles.activeFilter,
                ]}
                onPress={() => setTimeFilter('week')}
              >
                <Text
                  style={[
                    styles.filterText,
                    timeFilter === 'week' && styles.activeFilterText,
                  ]}
                >
                  Week
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  timeFilter === 'month' && styles.activeFilter,
                ]}
                onPress={() => setTimeFilter('month')}
              >
                <Text
                  style={[
                    styles.filterText,
                    timeFilter === 'month' && styles.activeFilterText,
                  ]}
                >
                  Month
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  timeFilter === 'all' && styles.activeFilter,
                ]}
                onPress={() => setTimeFilter('all')}
              >
                <Text
                  style={[
                    styles.filterText,
                    timeFilter === 'all' && styles.activeFilterText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.total_deliveries}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                AED {stats.total_earnings.toFixed(2)}
              </Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.average_rating}★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={deliveries}
          renderItem={renderDelivery}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FontAwesome5 name="inbox" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No deliveries found</Text>
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  activeFilter: {
    backgroundColor: '#2e7d32',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
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
  deliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryHeader: {
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addressSection: {
    gap: 8,
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    fontSize: 14,
    color: '#f4b400',
    fontWeight: '600',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
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