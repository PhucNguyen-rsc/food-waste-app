import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UpdateDriverDocumentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Driver Documents</Text>
      <Text>This screen will allow couriers to update their license and insurance information.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default UpdateDriverDocumentsScreen; 