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
import { RootStackParamList } from '@/navigation/types';
import { useAppSelector } from '@/store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

  const handleAddPaymentMethod = async () => {
    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      if (!cardNumber || !expiryDate || !cvv) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Validate card number (basic check)
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        Alert.alert('Error', 'Invalid card number');
        return;
      }

      // Validate expiry date format
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        Alert.alert('Error', 'Invalid expiry date format. Use MM/YY');
        return;
      }

      // Validate CVV
      if (cvv.length < 3 || cvv.length > 4) {
        Alert.alert('Error', 'Invalid CVV');
        return;
      }

      // Determine card type based on card number pattern
      const cleanCardNumber = cardNumber.replace(/\D/g, '');
      let cardType: PaymentType;
      
      // Visa: Starts with 4, length 13-16
      if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleanCardNumber)) {
        cardType = PaymentType.VISA;
      } 
      // Mastercard: Starts with 51-55 or 2221-2720, length 16
      else if (/^(5[1-5][0-9]{14}|2[2-7][0-9]{14})$/.test(cleanCardNumber)) {
        cardType = PaymentType.MASTERCARD;
      } else {
        Alert.alert('Error', 'Only VISA and Mastercard are supported. Please check your card number.');
        return;
      }

      console.log('Sending payment method request:', {
        type: cardType,
        cardNumber,
        expiryDate,
      });

      const response = await api.post('/users/payments/methods', {
        type: cardType,
        cardNumber,
        expiryDate,
      });

      console.log('Payment method response:', response.data);

      if (response.status === 201) {
        Alert.alert('Success', 'Payment method added successfully');
        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
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
          onPress={handleAddPaymentMethod}
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