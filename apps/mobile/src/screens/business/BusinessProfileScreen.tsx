import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import api from '@/lib/api';
import BusinessLayout from '@/components/BusinessLayout';
import { useAppDispatch, useAppSelector } from '@/store/index';
import { setUser } from '@/store/slices/authSlice';

export default function BusinessProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setBusinessName(user.businessName || '');
      setBusinessAddress(user.businessAddress || '');
      setBusinessPhone(user.businessPhone || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!businessName.trim()) {
      Alert.alert('Validation', 'Please enter your business name.');
      return;
    }

    if (!businessAddress.trim()) {
      Alert.alert('Validation', 'Please enter your business address.');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await api.patch('/business/profile', {
        businessName: businessName.trim(),
        businessAddress: businessAddress.trim(),
        businessPhone: businessPhone.trim(),
      });

      dispatch(setUser(response.data));
      Alert.alert('Success', 'Business profile updated successfully!');
    } catch (err: any) {
      console.error('Network or backend error:', err?.message || err);
      if (err?.response) {
        console.error('Backend responded with:', err.response.data);
      }
      Alert.alert('Error', 'Failed to update business profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BusinessLayout>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.heading}>Business Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Business Address"
              multiline
              numberOfLines={3}
              value={businessAddress}
              onChangeText={setBusinessAddress}
            />

            <TextInput
              style={styles.input}
              placeholder="Business Phone"
              keyboardType="phone-pad"
              value={businessPhone}
              onChangeText={setBusinessPhone}
            />

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleUpdateProfile}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Updating...' : 'Update Profile'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BusinessLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
}); 