import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ConsumerLayout from '@/components/ConsumerLayout';

export default function BusinessDetailsScreen() {
  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <Text>Business Details Screen</Text>
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
}); 