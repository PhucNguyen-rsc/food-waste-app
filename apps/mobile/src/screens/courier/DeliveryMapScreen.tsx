import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DeliveryMapScreen = ({ route, navigation }) => {
  const { delivery } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Delivery Route</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>
          Map would display here showing the route from restaurant to delivery location
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>Pickup Location</Text>
          <Text style={styles.locationAddress}>{delivery.restaurant?.address}</Text>
        </View>

        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>Delivery Location</Text>
          <Text style={styles.locationAddress}>{delivery.deliveryAddress}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 16,
  },
  detailsContainer: {
    padding: 16,
  },
  locationCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationAddress: {
    fontSize: 16,
    color: '#333',
  },
});

export default DeliveryMapScreen; 