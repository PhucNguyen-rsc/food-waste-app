import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ConsumerLayout from '@/components/ConsumerLayout';
import api from '@/lib/api';
import { PaymentType } from '@food-waste/types';
import { ConsumerStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store';

type NavigationProp = NativeStackNavigationProp<ConsumerStackParamList>;

export default function AddPaymentMethodScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { type } = route.params as { type: PaymentType };
  const user = useAppSelector((state) => state.auth.user);

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (text: string) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add slash after first 2 digits
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/users/payments/methods', {
        type,
        cardNumber: cardNumber.replace(/\s/g, ''), // Remove spaces from card number
        expiryDate
      });

      if (response.status === 201) {
        navigation.navigate('PaymentSuccess');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add payment method. Please try again.');
    }
  };

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Add {type} Card</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Adding...' : 'Add Card'}
          </Text>
        </TouchableOpacity>
      </View>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 