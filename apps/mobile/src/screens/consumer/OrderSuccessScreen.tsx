import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ConsumerLayout from '@/components/ConsumerLayout';
import { useNavigation } from '@react-navigation/native';

export default function OrderSuccessScreen() {
  const navigation = useNavigation();

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <Image
          source={require('@/assets/success.png')} // You can replace this with any checkmark or celebration icon
          style={styles.image}
        />
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully. We’ll notify you once it's ready!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ConsumerHomeScreen')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
