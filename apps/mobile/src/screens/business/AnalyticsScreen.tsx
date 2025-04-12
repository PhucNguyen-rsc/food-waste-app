import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BusinessLayout from '@/components/BusinessLayout';

export default function AnalyticsScreen() {
  return (
    <BusinessLayout title="Analytics">
      <View style={styles.container}>
        <Text style={styles.text}>Analytics Coming Soon</Text>
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