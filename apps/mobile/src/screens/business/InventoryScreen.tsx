import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BusinessLayout from '@/components/BusinessLayout';

export default function InventoryScreen() {
  return (
    <BusinessLayout title="Inventory" showBackButton>
      <View style={styles.container}>
        <Text style={styles.text}>Inventory Screen Coming Soon</Text>
      </View>
    </BusinessLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
}); 