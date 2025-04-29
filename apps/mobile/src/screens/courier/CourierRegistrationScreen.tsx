import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { courierDB } from '../../lib/db';

const CourierRegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    vehicleType: '',
    licenseNumber: '',
    insuranceNumber: '',
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      // Assuming we have user ID from auth context
      const userId = 'current-user-id'; // This should come from your auth system
      await courierDB.updateCourierProfile(userId, formData);
      Alert.alert('Success', 'Courier registration completed');
      navigation.navigate('CourierHome');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to complete registration');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Courier Registration</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={formData.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
          placeholder="Enter your first name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={formData.lastName}
          onChangeText={(text) => handleInputChange('lastName', text)}
          placeholder="Enter your last name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
          placeholder="Enter your address"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={formData.city}
          onChangeText={(text) => handleInputChange('city', text)}
          placeholder="Enter your city"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={styles.input}
          value={formData.country}
          onChangeText={(text) => handleInputChange('country', text)}
          placeholder="Enter your country"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Postal Code</Text>
        <TextInput
          style={styles.input}
          value={formData.postalCode}
          onChangeText={(text) => handleInputChange('postalCode', text)}
          placeholder="Enter your postal code"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Vehicle Type</Text>
        <TextInput
          style={styles.input}
          value={formData.vehicleType}
          onChangeText={(text) => handleInputChange('vehicleType', text)}
          placeholder="Enter your vehicle type"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>License Number</Text>
        <TextInput
          style={styles.input}
          value={formData.licenseNumber}
          onChangeText={(text) => handleInputChange('licenseNumber', text)}
          placeholder="Enter your license number"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Insurance Number</Text>
        <TextInput
          style={styles.input}
          value={formData.insuranceNumber}
          onChangeText={(text) => handleInputChange('insuranceNumber', text)}
          placeholder="Enter your insurance number"
        />
      </View>
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Register as Courier</Text>
      </TouchableOpacity>
    </ScrollView>
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
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CourierRegistrationScreen; 