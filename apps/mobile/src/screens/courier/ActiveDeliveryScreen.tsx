// apps/mobile/src/screens/courier/ActiveDeliveryScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CourierLayout from '@/components/CourierLayout';
import { Icon } from '@rneui/themed';
import { API_ENDPOINTS, handleApiError } from '@/config/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourierStackParamList } from '@/navigation/types';
import api from '@/lib/api';
import { OrderStatus } from '@food-waste/types';

type ActiveDeliveryScreenNavigationProp = NativeStackNavigationProp<CourierStackParamList, 'ActiveDelivery'>;

type ActiveDelivery = {
  id: string;
  orderId: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  estimatedTime: string;
};

export default function ActiveDeliveryScreen() {
  const [delivery, setDelivery] = useState<ActiveDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<ActiveDeliveryScreenNavigationProp>();

  useEffect(() => {
    fetchActiveDelivery();
    const interval = setInterval(fetchActiveDelivery, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchActiveDelivery = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.COURIER.ACTIVE_DELIVERY);
      setDelivery(response.data);
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (newStatus: OrderStatus) => {
    try {
      if (!delivery) return;

      await api.put(API_ENDPOINTS.COURIER.UPDATE_DELIVERY_STATUS(delivery.id), {
        status: newStatus,
      });

      if (newStatus === OrderStatus.COURIER_DELIVERED) {
        Alert.alert(
          'Delivery Marked as Complete',
          'The customer will be notified to confirm the delivery. You can view the status in your history.',
          [
            {
              text: 'View History',
              onPress: () => navigation.navigate('History'),
            },
            {
              text: 'OK',
              style: 'cancel',
            }
          ]
        );
      } else {
        fetchActiveDelivery();
      }
    } catch (err) {
      const apiError = handleApiError(err);
      Alert.alert('Error', apiError.message);
    }
  };

  if (loading) {
    return (
      <CourierLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </CourierLayout>
    );
  }

  if (error) {
    return (
      <CourierLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchActiveDelivery}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </CourierLayout>
    );
  }

  if (!delivery) {
    return (
      <CourierLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No active delivery</Text>
        </View>
      </CourierLayout>
    );
  }

  return (
    <CourierLayout>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.orderId}>Order #{delivery.orderId}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <View style={styles.detailRow}>
              <Icon name="account" type="material-community" size={20} color="#22C55E" />
              <Text style={styles.detailText}>{delivery.customerName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="phone" type="material-community" size={20} color="#22C55E" />
              <Text style={styles.detailText}>{delivery.customerPhone}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Location</Text>
            <View style={styles.detailRow}>
              <Icon name="store" type="material-community" size={20} color="#22C55E" />
              <Text style={styles.detailText}>{delivery.pickupAddress}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Location</Text>
            <View style={styles.detailRow}>
              <Icon name="home" type="material-community" size={20} color="#22C55E" />
              <Text style={styles.detailText}>{delivery.deliveryAddress}</Text>
            </View>
          </View>

          {/* Status Buttons */}
          <View style={styles.section}>
            {delivery.status === OrderStatus.CONFIRMED && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => updateDeliveryStatus(OrderStatus.PICKED_UP)}
              >
                <Text style={styles.actionButtonText}>Mark as Picked Up</Text>
              </TouchableOpacity>
            )}
            {delivery.status === OrderStatus.PICKED_UP && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => updateDeliveryStatus(OrderStatus.COURIER_DELIVERED)}
              >
                <Text style={styles.actionButtonText}>Mark as Delivered</Text>
              </TouchableOpacity>
            )}
            {delivery.status === OrderStatus.COURIER_DELIVERED && (
              <View>
                <Text style={styles.waitingText}>
                  Waiting for customer confirmation...
                </Text>
                <TouchableOpacity
                  style={styles.viewHistoryButton}
                  onPress={() => navigation.navigate('History')}
                >
                  <Text style={styles.viewHistoryButtonText}>View in History</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
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
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  actionButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
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
  waitingText: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 12,
  },
  viewHistoryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewHistoryButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
});
