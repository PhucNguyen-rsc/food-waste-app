import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ConsumerLayout from '@/components/ConsumerLayout';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PaymentSuccessScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#22C55E" />
        </View>
        <Text style={styles.title}>Payment Method Added!</Text>
        <Text style={styles.subtitle}>
          Your payment method has been successfully added and is ready to use.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CheckoutScreen')}
        >
          <Text style={styles.buttonText}>BACK TO CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 