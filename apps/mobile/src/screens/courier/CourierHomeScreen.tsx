// apps/mobile/src/screens/courier/CourierHomeScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import CourierLayout from '@/components/CourierLayout';
import { Ionicons } from '@expo/vector-icons';
import { API_ENDPOINTS, handleApiError } from '@/config/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourierStackParamList } from '@/navigation/types';
import api from '@/lib/api';

type CourierHomeScreenNavigationProp = NativeStackNavigationProp<CourierStackParamList, 'CourierHome'>;

type DeliveryRequest = {
  id: string;
  customerName: string;
  customerPhotoUrl?: string;
  distanceKm: number;
  pickupAddress: string;
  rewardAed: number;
};

type CourierStats = {
  completed: number;
  earnings: number;
  rating: number;
};

export default function CourierHomeScreen() {
  const [stats, setStats] = useState<CourierStats | null>(null);
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<CourierHomeScreenNavigationProp>();

  const fetchCourierData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }

      const [statsResponse, requestsResponse] = await Promise.all([
        api.get(API_ENDPOINTS.COURIER.STATS),
        api.get(API_ENDPOINTS.COURIER.NEW_REQUESTS),
      ]);

      setStats(statsResponse.data);
      setRequests(requestsResponse.data);
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCourierData();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchCourierData();
    }, [])
  );

  // Poll for new requests every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCourierData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCourierData(true);
  }, []);

  const acceptDelivery = async (deliveryId: string) => {
    try {
      setLoading(true); // Show loading state
      await api.put(API_ENDPOINTS.COURIER.ACCEPT_DELIVERY(deliveryId));
      
      // Remove the accepted delivery from the list
      setRequests((prev) => prev.filter((request) => request.id !== deliveryId));
      
      // Show success message and navigate to History screen
      Alert.alert(
        'Success',
        'Delivery accepted successfully! You can view it in your active deliveries.',
        [
          {
            text: 'View Delivery',
            onPress: () => navigation.navigate('History'),
          },
          {
            text: 'Stay Here',
            style: 'cancel',
          }
        ]
      );
    } catch (err) {
      const apiError = handleApiError(err);
      Alert.alert('Error', apiError.message);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const declineDelivery = (deliveryId: string) => {
    setRequests((prev) => prev.filter((request) => request.id !== deliveryId));
  };

  if (loading) {
    return (
      <CourierLayout title="New Deliveries">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </CourierLayout>
    );
  }

  if (error) {
    return (
      <CourierLayout title="New Deliveries">
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCourierData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </CourierLayout>
    );
  }

  return (
    <CourierLayout title="New Deliveries">
      <View style={styles.container}>
        {/* Stats Section */}
        {stats && (
          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.completed}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>AED {stats.earnings}</Text>
                <Text style={styles.statLabel}>Earnings</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {stats.rating} <Ionicons name="star" size={14} color="#FACC15" />
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
        )}

        {/* Requests List */}
        <Text style={styles.newRequestsTitle}>New Requests</Text>
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.requestCard}>
              <View style={styles.requestTopRow}>
                <Image
                  source={
                    item.customerPhotoUrl
                      ? { uri: item.customerPhotoUrl }
                      : undefined
                  }
                  style={styles.avatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.customerName}>{item.customerName}</Text>
                  <Text style={styles.customerDistance}>{item.distanceKm} km away</Text>
                </View>
                <View style={styles.rewardBadge}>
                  <Text style={styles.rewardText}>AED {item.rewardAed}</Text>
                </View>
              </View>

              <View style={styles.addressRow}>
                <Ionicons name="location" size={16} color="#6B7280" />
                <Text style={styles.addressText}>{item.pickupAddress}</Text>
              </View>

              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptDelivery(item.id)}
                >
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => declineDelivery(item.id)}
                >
                  <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No new delivery requests</Text>
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
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#065F46',
  },
  statLabel: {
    fontSize: 12,
    color: '#065F46',
  },
  newRequestsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  requestTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  customerDistance: {
    fontSize: 12,
    color: '#6B7280',
  },
  rewardBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  declineButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
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
    fontSize: 16,
  },
});
