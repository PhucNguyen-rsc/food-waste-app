// CheckoutScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ConsumerLayout from '@/components/ConsumerLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import api from '@/lib/api';
import { auth } from '@/config/firebaseConfig';
import { PaymentType } from '@food-waste/types';
import { isValidPaymentMethod } from '@/config/paymentConfig';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PaymentMethod = {
  id: string;
  type: PaymentType;
  cardNumber: string;
  cardBrand: string;
  expiryDate: string;
  isDefault: boolean;
};

export default function CheckoutScreen() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card'>('Cash');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert(
            'Authentication Required',
            'Please sign in to proceed with checkout.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => navigation.goBack(),
              },
              {
                text: 'Sign In',
                onPress: () => navigation.navigate('SignIn'),
              },
            ]
          );
          return;
        }

        setIsAuthenticated(true);
        await fetchPaymentMethods();
      } catch (error) {
        console.error('Auth check failed:', error);
        Alert.alert('Error', 'Failed to verify authentication. Please try again.');
        navigation.goBack();
      }
    };

    checkAuth();
  }, []);

  // Pre-populate user data when component mounts
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAddress(user.deliveryAddress || '');
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (isAuthenticated) {
        fetchPaymentMethods();
      }
    }, [isAuthenticated])
  );

  const fetchPaymentMethods = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No authenticated user found');
        setLoading(false);
        return;
      }

      console.log('Fetching payment methods for user:', user.uid);
      const response = await api.get('/users/payments/methods');
      console.log('Payment methods response:', response.data);
      
      // Validate payment methods using the isValidPaymentMethod function
      const validPaymentMethods = response.data.filter((method: PaymentMethod) => 
        isValidPaymentMethod(method.type)
      );
      
      setPaymentMethods(validPaymentMethods);
    } catch (error: any) {
      console.error('Failed to fetch payment methods:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Alert.alert(
        'Error',
        'Failed to fetch payment methods. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove any spaces, dashes, or other non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // UAE phone number validation:
    // - Must start with 971 (country code) or 0
    // - Must be 9-12 digits long (including country code)
    // - If starts with 0, must be followed by 5
    // - If starts with 971, must be followed by 5
    const uaePhoneRegex = /^(?:971|0)?5[0-9]{8}$/;
    
    return uaePhoneRegex.test(cleanedPhone);
  };

  const handleCheckout = async () => {
    try {
      // Validate all required fields
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }
      if (!address.trim()) {
        Alert.alert('Error', 'Please enter your delivery address');
        return;
      }
      if (!phone.trim()) {
        Alert.alert('Error', 'Please enter your phone number');
        return;
      }
      if (!validatePhoneNumber(phone)) {
        Alert.alert(
          'Invalid Phone Number',
          'Please enter a valid UAE phone number.\nExample: +971 50 123 4567 or 050 123 4567'
        );
        return;
      }
      if (paymentMethod === 'Card' && !selectedPaymentMethodId) {
        Alert.alert('Error', 'Please select a payment method');
        return;
      }

      setIsProcessing(true);

      // Format phone number before sending to API
      let formattedPhone = phone.replace(/\D/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '971' + formattedPhone.substring(1);
      }

      // Create order
      const orderData = {
        deliveryAddress: address,
        phone: formattedPhone,
        items: cartItems.map(item => ({
          foodItemId: item.id,
          quantity: item.quantity
        }))
      };

      const response = await api.post('/consumer/orders', orderData);
      const orders = response.data;

      // Clear cart
      dispatch(clearCart());
      
      // Navigate to success screen with the first order ID
      // Note: We take the first order ID since the backend might create multiple orders
      // if items are from different businesses
      navigation.navigate('Consumer', { screen: 'OrderSuccessScreen', params: { orderId: orders[0].id } });
    } catch (error: any) {
      console.error('Checkout error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddPaymentMethod = () => {
    navigation.navigate('PaymentMethods');
  };

  const handleDeletePaymentMethod = async (methodId: string) => {
    try {
      await api.delete(`/users/payments/methods/${methodId}`);
      // Refresh payment methods after deletion
      await fetchPaymentMethods();
      Alert.alert('Success', 'Payment method deleted successfully');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      Alert.alert('Error', 'Failed to delete payment method');
    }
  };

  const renderPaymentMethods = () => {
    if (paymentMethod !== 'Card') return null;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (paymentMethods.length === 0) {
      return (
        <TouchableOpacity
          style={styles.addPaymentButton}
          onPress={handleAddPaymentMethod}
        >
          <Text style={styles.addPaymentButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.paymentMethodsContainer}>
        {paymentMethods.map((method) => (
          <View key={method.id} style={styles.paymentMethodItemContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodItem,
                selectedPaymentMethodId === method.id && styles.selectedPaymentMethod,
              ]}
              onPress={() => setSelectedPaymentMethodId(method.id)}
            >
              <Text style={styles.paymentMethodText}>
                {method.cardBrand} **** {method.cardNumber.slice(-4)}
              </Text>
              {method.isDefault && (
                <Text style={styles.defaultBadge}>Default</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletePaymentMethod(method.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addAnotherPaymentButton}
          onPress={handleAddPaymentMethod}
        >
          <Text style={styles.addAnotherPaymentButtonText}>
            Add Another Payment Method
          </Text>
        </TouchableOpacity>
      </View>
    );
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
        <View style={styles.paymentMethodToggle}>
          <TouchableOpacity
            style={[
              styles.paymentMethodButton,
              paymentMethod === 'Cash' && styles.selectedPaymentMethodButton,
            ]}
            onPress={() => setPaymentMethod('Cash')}
          >
            <Text
              style={[
                styles.paymentMethodButtonText,
                paymentMethod === 'Cash' && styles.selectedPaymentMethodButtonText,
              ]}
            >
              Cash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentMethodButton,
              paymentMethod === 'Card' && styles.selectedPaymentMethodButton,
            ]}
            onPress={() => setPaymentMethod('Card')}
          >
            <Text
              style={[
                styles.paymentMethodButtonText,
                paymentMethod === 'Card' && styles.selectedPaymentMethodButtonText,
              ]}
            >
              Card
            </Text>
          </TouchableOpacity>
        </View>

        {renderPaymentMethods()}

        <TouchableOpacity
          style={[styles.checkoutButton, isProcessing && styles.disabledButton]}
          onPress={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ConsumerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  paymentMethodToggle: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  paymentMethodButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  selectedPaymentMethodButton: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  paymentMethodButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedPaymentMethodButtonText: {
    color: '#fff',
  },
  paymentMethodsContainer: {
    marginBottom: 20,
  },
  paymentMethodItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentMethodItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  selectedPaymentMethod: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  paymentMethodText: {
    fontSize: 16,
  },
  defaultBadge: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '600',
  },
  addPaymentButton: {
    padding: 16,
    backgroundColor: '#22C55E',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addPaymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addAnotherPaymentButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#22C55E',
    borderRadius: 8,
    alignItems: 'center',
  },
  addAnotherPaymentButtonText: {
    color: '#22C55E',
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 8,
    padding: 12,
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
