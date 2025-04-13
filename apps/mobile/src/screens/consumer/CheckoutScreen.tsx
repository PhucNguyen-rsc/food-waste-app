// CheckoutScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ConsumerLayout from '@/components/ConsumerLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearCart } from '@/store/cartSlice';
import { useNavigation } from '@react-navigation/native';

export default function CheckoutScreen() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card'>('Cash');

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleCheckout = async () => {
    if (!name || !address || !phone) {
      Alert.alert('Incomplete Info', 'Please fill all required fields.');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart.');
      return;
    }

    const payload = {
      customerName: name,
      deliveryAddress: address,
      phoneNumber: phone,
      paymentMethod,
      items: cartItems.map((item) => ({
        foodItemId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      // Replace with: await api.post('/orders', payload);
      console.log('[PLACE ORDER]', payload);

      dispatch(clearCart());
      navigation.navigate('OrderSuccessScreen');
    } catch (error) {
      console.error('Order failed', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  return (
    <ConsumerLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Checkout</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Delivery Address</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Street, City, Zip"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. +971 50 123 4567"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            onPress={() => setPaymentMethod('Cash')}
            style={styles.radioItem}
          >
            <View
              style={[
                styles.radioCircle,
                paymentMethod === 'Cash' && styles.radioSelected,
              ]}
            />
            <Text style={styles.radioText}>Cash on Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPaymentMethod('Card')}
            style={styles.radioItem}
          >
            <View
              style={[
                styles.radioCircle,
                paymentMethod === 'Card' && styles.radioSelected,
              ]}
            />
            <Text style={styles.radioText}>Card</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    marginTop: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
  },
  radioSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#22C55E',
  },
  radioText: {
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
