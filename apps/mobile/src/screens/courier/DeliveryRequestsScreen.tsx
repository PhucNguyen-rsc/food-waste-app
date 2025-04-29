import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { CourierAPI } from '@/lib/courier-api';
import { useAppSelector } from '@/store';
import { courierDB } from '../../lib/db';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type DeliveryRequest = {
  id: string;
  orderId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  pickupLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  dropoffLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  consumer: {
    id: string;
    name: string;
    email: string;
  };
  business: {
    id: string;
    name: string;
    address: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  deliveryFee: number;
  estimatedDistance: string;
  estimatedEarnings: number;
};

const DeliveryRequestsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;
  
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveries = async () => {
    if (!userId) {
      setError('User not found. Please sign in again.');
      setLoading(false);
      setRefreshing(false);
      return;
    }
    
    setError(null);
    if (!refreshing) setLoading(true);
    
    try {
      const availableDeliveries = await courierDB.getAvailableDeliveries();
      setDeliveries(availableDeliveries);
    } catch (error) {
      console.error('Failed to fetch delivery requests:', error);
      setError('Failed to load delivery requests. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDeliveries();
  };

  const handleAcceptDelivery = async (orderId: string) => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please sign in again.');
      return;
    }
    
    setLoading(true);
    try {
      await courierDB.acceptDelivery(orderId, userId);
      
      setDeliveries(deliveries.filter(delivery => delivery.id !== orderId));
      
      navigation.navigate('DeliveryDetails', { orderId });
    } catch (error) {
      console.error('Failed to accept delivery:', error);
      Alert.alert('Error', 'Failed to accept delivery. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDeliveries();
    });
    
    return unsubscribe;
  }, [navigation]);

  const calculateTimeEstimate = (distance: string) => {
    // Simple calculation based on distance
    // In a real app, this would use Google Maps API for accurate estimates
    const distanceValue = parseFloat(distance);
    const avgSpeed = 15; // mph
    const timeInMinutes = Math.round((distanceValue / avgSpeed) * 60);
    return `${timeInMinutes} mins`;
  };

  const renderDeliveryItem = ({ item }: { item: DeliveryRequest }) => {
    const timeToDelivery = calculateTimeEstimate(item.estimatedDistance);
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Text style={styles.orderId}>Order #{item.orderId}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Pickup:</Text>
            <View style={styles.locationDetails}>
              <Text style={styles.locationText}>{item.pickupLocation.address}</Text>
              <Text style={styles.businessName}>{item.business.name}</Text>
            </View>
          </View>
          
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Dropoff:</Text>
            <View style={styles.locationDetails}>
              <Text style={styles.locationText}>{item.dropoffLocation.address}</Text>
            </View>
          </View>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={styles.detailValue}>{item.estimatedDistance}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Est. Time</Text>
              <Text style={styles.detailValue}>{timeToDelivery}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Earnings</Text>
              <Text style={styles.detailValue}>${item.estimatedEarnings.toFixed(2)}</Text>
            </View>
          </View>
        </Card.Content>
        
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained"
            onPress={() => handleAcceptDelivery(item.id)}
            style={styles.acceptButton}
            disabled={loading}
          >
            Accept Delivery
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loaderText}>Loading delivery requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Delivery Requests</Text>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={handleRefresh}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          renderItem={renderDeliveryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No delivery requests available</Text>
              <Text style={styles.emptySubtext}>Pull down to refresh or check back later</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  locationContainer: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  locationLabel: {
    fontWeight: '600',
    width: 70,
  },
  locationDetails: {
    flex: 1,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
  },
  businessName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  cardActions: {
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  acceptButton: {
    paddingHorizontal: 8,
    backgroundColor: '#22c55e',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#e53e3e',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#22c55e',
  },
});

export default DeliveryRequestsScreen; 