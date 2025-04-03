// src/screens/RoleSelectionScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/store/slices/authSlice';
import api from '@/lib/api';
import { UserRole } from '@food-waste/types';

type RoleSelectionNavProp = NativeStackNavigationProp<RootStackParamList, 'RoleSelection'>;

export default function RoleSelectionScreen() {
  const navigation = useNavigation<RoleSelectionNavProp>();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async (role: UserRole) => {
    try {
      setLoading(true);
      
      // Update user role in backend
      const response = await api.patch('/users/update-role', { role });
      const { accessToken, user } = response.data;

      // Update user and token in Redux store
      dispatch(setUser(user));
      dispatch(setToken(accessToken));

      // Navigate to appropriate screen based on role
      switch (role) {
        case UserRole.BUSINESS:
          navigation.replace('BusinessHome');
          break;
        case UserRole.CONSUMER:
          navigation.replace('ConsumerHome');
          break;
        case UserRole.COURIER:
          navigation.replace('CourierHome');
          break;
        default:
          navigation.replace('ConsumerHome'); // Default to consumer home
      }
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Failed to update role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Updating your role...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>

      {/* Business Owner */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelection(UserRole.BUSINESS)}
      >
        <Text style={styles.buttonText}>Business Owner</Text>
        <Text style={styles.subtitle}>Manage your dashboard and orders</Text>
      </TouchableOpacity>

      {/* Consumer */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelection(UserRole.CONSUMER)}
      >
        <Text style={styles.buttonText}>Consumer</Text>
        <Text style={styles.subtitle}>Browse and purchase items</Text>
      </TouchableOpacity>

      {/* Courier */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleRoleSelection(UserRole.COURIER)}
      >
        <Text style={styles.buttonText}>Courier</Text>
        <Text style={styles.subtitle}>Deliver orders</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
