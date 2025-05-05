// src/config/paymentConfig.ts
import { PaymentType } from '@food-waste/types';

// Define supported payment methods using the shared PaymentType
export const SUPPORTED_PAYMENT_METHODS = {
  PAYPAL: PaymentType.PAYPAL,
  MASTERCARD: PaymentType.MASTERCARD,
  VISA: PaymentType.VISA,
} as const;

// Export payment configuration
export const PAYMENT_CONFIG = {
  PAYPAL: {
    CLIENT_ID: process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID || 'dummy-client-id',
    SECRET: process.env.EXPO_PUBLIC_PAYPAL_SECRET || 'dummy-secret',
    ENVIRONMENT: process.env.EXPO_PUBLIC_PAYPAL_ENVIRONMENT || 'sandbox',
  },
  SUPPORTED_METHODS: SUPPORTED_PAYMENT_METHODS,
} as const;

// Type for payment methods
export type PaymentMethodType = PaymentType;

// Validation function
export const isValidPaymentMethod = (method: string): method is PaymentMethodType => {
  return Object.values(PaymentType).includes(method as PaymentType);
}; 