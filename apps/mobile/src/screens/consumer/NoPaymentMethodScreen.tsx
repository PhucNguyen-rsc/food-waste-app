import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import ConsumerLayout from '@/components/ConsumerLayout';
import { Icon } from '@rneui/themed';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NoPaymentMethodScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name="card-outline" size={80} color="#22C55E" />
        </View>
        <Text style={styles.title}>Don't have any card</Text>
        <Text style={styles.subtitle}>
          It seems like you have not added any credit or debit card. You may easily add card.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PaymentMethods')}
        >
          <Text style={styles.buttonText}>ADD CREDIT CARDS</Text>
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