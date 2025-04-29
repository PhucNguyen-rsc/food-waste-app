import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { CourierAPI } from '@/lib/courier-api';
import { useAppSelector } from '@/store';
import CourierLayout from '@/components/CourierLayout';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type VehicleInfo = {
  vehicleType: string;
  make: string;
  model: string;
  licensePlate: string;
  year: string;
};

const VehicleInfoScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    vehicleType: '',
    make: '',
    model: '',
    licensePlate: '',
    year: '',
  });

  useEffect(() => {
    fetchVehicleInfo();
  }, []);

  const fetchVehicleInfo = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const profile = await CourierAPI.getCourierProfile(user.id);
      
      // Extract vehicle information from profile
      if (profile) {
        // For now, we only have vehicleType in the profile
        // The other fields would need to be stored in a different way
        // or retrieved from a different endpoint in a real app
        setVehicleInfo({
          vehicleType: profile.vehicleType || '',
          make: '', // In a real app, these would come from the backend
          model: '',
          licensePlate: '',
          year: '',
        });
      }
    } catch (error) {
      console.error('Error fetching vehicle info:', error);
      Alert.alert('Error', 'Failed to load vehicle information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVehicleInfo = async () => {
    if (!user?.id) return;
    
    // Validate input
    if (!vehicleInfo.vehicleType || !vehicleInfo.make || !vehicleInfo.model || !vehicleInfo.licensePlate) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      // Only update vehicleType in the profile for now
      // In a real app, you would create a separate endpoint for vehicle details
      // or extend the profile schema to include these fields
      await CourierAPI.updateCourierProfile(user.id, {
        vehicleType: vehicleInfo.vehicleType,
        // For a real app, you would save the rest of the fields too
      });
      
      Alert.alert('Success', 'Vehicle information updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating vehicle info:', error);
      Alert.alert('Error', 'Failed to update vehicle information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CourierLayout title="Vehicle Information">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Vehicle Information</Text>
        <Text style={styles.subtitle}>Update your vehicle details below</Text>
        
        <View style={styles.formContainer}>
          <TextInput
            label="Vehicle Type *"
            value={vehicleInfo.vehicleType}
            onChangeText={(text) => setVehicleInfo({...vehicleInfo, vehicleType: text})}
            style={styles.input}
            placeholder="Car, Motorcycle, Bicycle, etc."
            disabled={loading}
          />
          
          <TextInput
            label="Make *"
            value={vehicleInfo.make}
            onChangeText={(text) => setVehicleInfo({...vehicleInfo, make: text})}
            style={styles.input}
            placeholder="Toyota, Honda, etc."
            disabled={loading}
          />
          
          <TextInput
            label="Model *"
            value={vehicleInfo.model}
            onChangeText={(text) => setVehicleInfo({...vehicleInfo, model: text})}
            style={styles.input}
            placeholder="Camry, Civic, etc."
            disabled={loading}
          />
          
          <TextInput
            label="License Plate *"
            value={vehicleInfo.licensePlate}
            onChangeText={(text) => setVehicleInfo({...vehicleInfo, licensePlate: text})}
            style={styles.input}
            placeholder="ABC123"
            disabled={loading}
          />
          
          <TextInput
            label="Year"
            value={vehicleInfo.year}
            onChangeText={(text) => setVehicleInfo({...vehicleInfo, year: text})}
            style={styles.input}
            placeholder="2023"
            keyboardType="numeric"
            disabled={loading}
          />
          
          <Text style={styles.requiredText}>* Required fields</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleUpdateVehicleInfo}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Save Changes
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            disabled={loading}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </CourierLayout>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  requiredText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#22c55e',
  },
  cancelButton: {
    borderColor: '#22c55e',
  },
});

export default VehicleInfoScreen; 