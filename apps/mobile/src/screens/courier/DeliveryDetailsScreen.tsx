// apps/mobile/src/screens/courier/DeliveryDetailsScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
} from 'react-native';
import CourierLayout from '@/components/CourierLayout';
import { Icon } from '@rneui/themed';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { API_ENDPOINTS, handleApiError } from '@/config/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CourierStackParamList } from '@/navigation/types';
import api from '@/lib/api';

type DeliveryDetailsScreenNavigationProp = NativeStackNavigationProp<CourierStackParamList, 'DeliveryDetails'>;
type DeliveryDetailsRouteProp = RouteProp<CourierStackParamList, 'DeliveryDetails'>;

type DeliveryDetails = {
  id: string;
  customerName: string;
  customerPhotoUrl?: string;
  pickupAddress: string;
  deliveryAddress: string;
  distanceKm: number;
  estimatedTime: string;
  rewardAed: number;
};

export default function DeliveryDetailsScreen() {
  const navigation = useNavigation<DeliveryDetailsScreenNavigationProp>();
  const route = useRoute<DeliveryDetailsRouteProp>();

  const { deliveryId } = route.params;
  const [delivery, setDelivery] = useState<DeliveryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeliveryDetails();
  }, []);

  const fetchDeliveryDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.COURIER.DELIVERY_DETAILS(deliveryId));
      setDelivery(response.data);
      setError(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptDelivery = async () => {
    try {
      await api.put(API_ENDPOINTS.COURIER.ACCEPT_DELIVERY(deliveryId));
      navigation.navigate('ActiveDelivery');
    } catch (err) {
      const apiError = handleApiError(err);
      Alert.alert('Error', apiError.message);
    }
  };

  const declineDelivery = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <CourierLayout title="Delivery Details">
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </CourierLayout>
    );
  }

  if (error) {
    return (
      <CourierLayout title="Delivery Details">
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDeliveryDetails}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </CourierLayout>
    );
  }

  if (!delivery) {
    return (
      <CourierLayout title="Delivery Details">
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No delivery details available</Text>
        </View>
      </CourierLayout>
    );
  }

  const imageSource: ImageSourcePropType | undefined = delivery.customerPhotoUrl
    ? { uri: delivery.customerPhotoUrl }
    : undefined;

  return (
    <CourierLayout title="Delivery Details">
      <View style={styles.container}>
        <View style={styles.card}>
          {imageSource && (
          <Image
              source={imageSource}
            style={styles.avatar}
          />
          )}
          <Text style={styles.name}>{delivery.customerName}</Text>

          <View style={styles.section}>
            <Icon name="store" type="material-community" size={20} color="#22C55E" />
            <Text style={styles.detailText}>Pickup: {delivery.pickupAddress}</Text>
          </View>

          <View style={styles.section}>
            <Icon name="home" type="material-community" size={20} color="#22C55E" />
            <Text style={styles.detailText}>Delivery: {delivery.deliveryAddress}</Text>
          </View>

          <View style={styles.section}>
            <Icon name="map-marker" type="material-community" size={20} color="#22C55E" />
            <Text style={styles.detailText}>{delivery.distanceKm} km</Text>
          </View>

          <View style={styles.section}>
            <Icon name="clock" type="material-community" size={20} color="#22C55E" />
            <Text style={styles.detailText}>ETA: {delivery.estimatedTime}</Text>
          </View>

          <View style={styles.rewardRow}>
            <Text style={styles.rewardText}>AED {delivery.rewardAed}</Text>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={acceptDelivery}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={declineDelivery}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
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
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  rewardRow: {
    marginTop: 16,
    marginBottom: 24,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#065F46',
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  declineButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
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
