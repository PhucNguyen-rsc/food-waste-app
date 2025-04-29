import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { CourierAPI } from '@/lib/courier-api';
import { useAppSelector } from '@/store';
import * as Location from '@/lib/location-service';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AvailabilityToggleScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;
  
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Request location permissions and get initial location
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        setLoading(true);
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        setLocation(location);
        setLoading(false);
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Error getting current location');
        setLoading(false);
      }
    })();
  }, []);

  const toggleAvailability = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please sign in again.');
      return;
    }
    
    const newStatus = !isAvailable;
    setLoading(true);
    
    try {
      // Get current location if going online
      let currentLocation = location;
      if (newStatus && !currentLocation) {
        try {
          currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
          });
          setLocation(currentLocation);
        } catch (error) {
          setErrorMsg('Error getting current location');
          setLoading(false);
          return;
        }
      }
      
      // Update availability status in database
      const locationData = currentLocation 
        ? { 
            latitude: currentLocation.coords.latitude, 
            longitude: currentLocation.coords.longitude 
          } 
        : undefined;
      
      await CourierAPI.updateAvailability(userId, newStatus, locationData);
      
      // Update local state
      setIsAvailable(newStatus);
    } catch (error) {
      console.error('Error updating availability:', error);
      Alert.alert('Error', 'Failed to update availability status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please sign in again.');
      return;
    }
    
    setLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      setLocation(location);
      
      // Update courier location in database
      await CourierAPI.updateLocation(userId, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      Alert.alert('Success', 'Your location has been updated.');
    } catch (error) {
      console.error('Error updating location:', error);
      setErrorMsg('Error updating location');
      Alert.alert('Error', 'Failed to update location. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const viewDeliveryRequests = () => {
    if (!isAvailable) {
      Alert.alert('Not Available', 'You must be online to view delivery requests.');
      return;
    }
    navigation.navigate('DeliveryRequests');
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.title}>Availability Status</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.statusText}>
            {isAvailable ? 'Online' : 'Offline'}
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isAvailable ? '#006400' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleAvailability}
            value={isAvailable}
            style={styles.switch}
            disabled={loading}
          />
        </View>
      </View>

      {isAvailable && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          {errorMsg ? (
            <View>
              <Text style={styles.errorText}>{errorMsg}</Text>
              <Button 
                mode="contained" 
                onPress={updateLocation}
                style={styles.retryButton}
                disabled={loading}
              >
                Retry
              </Button>
            </View>
          ) : loading ? (
            <Text style={styles.loadingText}>Updating location...</Text>
          ) : location ? (
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                Latitude: {location.coords.latitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                Longitude: {location.coords.longitude.toFixed(6)}
              </Text>
              <Text style={styles.locationTimeText}>
                Last updated: {new Date(location.timestamp).toLocaleTimeString()}
              </Text>
              <Button 
                mode="contained" 
                onPress={updateLocation}
                style={styles.updateButton}
                disabled={loading}
              >
                Update Location
              </Button>
            </View>
          ) : (
            <Text style={styles.loadingText}>Getting location...</Text>
          )}
          
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Your location is only shared while you are online and accepting deliveries.
            </Text>
          </View>
          
          <Button
            mode="contained"
            onPress={viewDeliveryRequests}
            style={[styles.button, styles.topMargin]}
            disabled={!isAvailable || loading}
          >
            View Delivery Requests
          </Button>
        </View>
      )}
      
      {!isAvailable && (
        <View style={styles.offlineMessage}>
          <Text style={styles.offlineText}>
            You're currently offline. Toggle the switch above to go online and start accepting delivery requests.
          </Text>
        </View>
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
    marginBottom: 24,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 32,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 16,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  locationContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 8,
  },
  locationTimeText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  updateButton: {
    marginTop: 12,
  },
  retryButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    padding: 8,
  },
  topMargin: {
    marginTop: 24,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  loadingText: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#e6f7ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1890ff',
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  offlineMessage: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  offlineText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default AvailabilityToggleScreen; 