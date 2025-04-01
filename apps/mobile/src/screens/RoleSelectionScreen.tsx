// src/screens/RoleSelectionScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

type RoleSelectionNavProp = NativeStackNavigationProp<RootStackParamList, 'RoleSelection'>;

export default function RoleSelectionScreen() {
  const navigation = useNavigation<RoleSelectionNavProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>

      {/* Business Owner */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BusinessHome')}
      >
        <Text style={styles.buttonText}>Business Owner</Text>
        <Text style={styles.subtitle}>Manage your dashboard and orders</Text>
      </TouchableOpacity>

      {/* Consumer */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ConsumerHome')}
      >
        <Text style={styles.buttonText}>Consumer</Text>
        <Text style={styles.subtitle}>Browse and purchase items</Text>
      </TouchableOpacity>

      {/* Courier - optional */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('Courier role chosen!');
          // Optionally, navigate to a CourierHome screen when ready:
          // navigation.navigate('CourierHome');
        }}
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
