// src/screens/consumer/ProfileScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ConsumerLayout from '@/components/ConsumerLayout';
import { useAppSelector } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = async () => {
    try {
      Alert.alert('Logged out', 'You have been logged out successfully.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (err) {
      Alert.alert('Logout Failed', 'Please try again.');
    }
  };

  return (
    <ConsumerLayout title="My Profile">
      <View style={styles.container}>
        <Text style={styles.heading}>My Profile</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.name || 'N/A'}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || 'N/A'}</Text>

          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user?.role || 'Consumer'}</Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('Consumer', { screen: 'ChangePassword' })}
        >
          <Text style={styles.editButtonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
