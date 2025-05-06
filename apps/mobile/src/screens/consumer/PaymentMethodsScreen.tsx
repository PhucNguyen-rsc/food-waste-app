import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ConsumerStackParamList } from '@/navigation/types';
import { PaymentType } from '@food-waste/types';
import ConsumerLayout from '@/components/ConsumerLayout';
import { Icon } from '@rneui/themed';

type NavigationProp = NativeStackNavigationProp<ConsumerStackParamList>;

type PaymentMethodInfo = {
  type: PaymentType;
  name: string;
  icon: string;
  color: string;
};

// Define payment methods array
const paymentMethods: PaymentMethodInfo[] = [
  {
    type: PaymentType.PAYPAL,
    name: 'PayPal',
    icon: 'paypal',
    color: '#003087',
  },
  {
    type: PaymentType.VISA,
    name: 'Visa',
    icon: 'cc-visa',
    color: '#1A1F71',
  },
  {
    type: PaymentType.MASTERCARD,
    name: 'Mastercard',
    icon: 'cc-mastercard',
    color: '#EB001B',
  },
];

export default function PaymentMethodsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleSelectMethod = (type: PaymentType) => {
    navigation.navigate('AddPaymentMethod', { type });
  };

  return (
    <ConsumerLayout>
      <View style={styles.container}>
        <Text style={styles.title}>Select Payment Method</Text>
        <View style={styles.methods}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.type}
              style={styles.method}
              onPress={() => handleSelectMethod(method.type)}
            >
              <Icon 
                name={method.icon} 
                type="font-awesome" 
                size={40} 
                color={method.color} 
              />
              <Text style={styles.methodName}>{method.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  methods: {
    gap: 16,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  methodName: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
}); 