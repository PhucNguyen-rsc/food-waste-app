import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { courierDB } from '../../lib/db';

const DeliveryDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        // Assuming we have a method to get a specific delivery by ID
        // This would normally be part of courierDB but for this example we'll simulate it
        const userId = 'current-user-id'; // This should come from your auth system
        const deliveries = await courierDB.getDeliveries(userId);
        const foundDelivery = deliveries.find(d => d.id === orderId);
        
        if (foundDelivery) {
          setDelivery(foundDelivery);
        } else {
          Alert.alert('Error', 'Delivery not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Failed to fetch delivery details:', error);
        Alert.alert('Error', 'Failed to load delivery details');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [orderId, navigation]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await courierDB.updateDeliveryStatus(orderId, newStatus);
      
      // Update the local state with the new status
      setDelivery({
        ...delivery,
        status: newStatus
      });
      
      if (newStatus === 'DELIVERED') {
        Alert.alert(
          'Delivery Completed',
          'Delivery has been marked as completed!',
          [{ text: 'OK', onPress: () => navigation.navigate('CourierHome') }]
        );
      } else {
        Alert.alert('Status Updated', `Delivery status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      Alert.alert('Error', 'Failed to update delivery status');
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading delivery details...</Text>
      </View>
    );
  }

  if (!delivery) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Delivery not found</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Delivery #{orderId.slice(0, 8)}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{delivery.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restaurant Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailValue}>{delivery.restaurant?.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{delivery.restaurant?.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{delivery.restaurant?.phone}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailValue}>{delivery.user?.name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{delivery.deliveryAddress}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{delivery.user?.phone}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {delivery.items?.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.quantity} x {item.foodItem.name}</Text>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subtotal:</Text>
            <Text style={styles.detailValue}>${delivery.subtotal?.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery Fee:</Text>
            <Text style={styles.detailValue}>${delivery.deliveryFee?.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, styles.totalLabel]}>Total:</Text>
            <Text style={[styles.detailValue, styles.totalValue]}>
              ${delivery.totalPrice?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {delivery.status === 'PICKED_UP' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={() => handleUpdateStatus('OUT_FOR_DELIVERY')}
          >
            <Text style={styles.buttonText}>Start Delivery</Text>
          </TouchableOpacity>
        )}
        
        {delivery.status === 'OUT_FOR_DELIVERY' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={() => handleUpdateStatus('DELIVERED')}
          >
            <Text style={styles.buttonText}>Mark as Delivered</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]} 
          onPress={() => navigation.navigate('DeliveryMapScreen', { delivery })}
        >
          <Text style={styles.secondaryButtonText}>View on Map</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#f44336',
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    minWidth: 120,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#0097a7',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 90,
    fontWeight: '500',
    color: '#666',
  },
  detailValue: {
    flex: 1,
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  actionsContainer: {
    marginVertical: 24,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeliveryDetailsScreen; 