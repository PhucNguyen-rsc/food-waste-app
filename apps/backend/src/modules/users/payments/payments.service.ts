import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { PaymentType, UserRole } from '@food-waste/types';
import { UsersService } from '../users.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async getPaymentMethods(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async addPaymentMethod(userId: string, data: {
    type: PaymentType;
    cardNumber: string;
    expiryDate: string;
    isDefault?: boolean;
  }) {
    // Check if user exists
    const user = await this.usersService.findByFirebaseUid(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // For PayPal, we don't need card validation
    if (data.type === PaymentType.PAYPAL) {
      return this.prisma.paymentMethod.create({
        data: {
          type: PaymentType.PAYPAL,
          cardNumber: null,
          cardBrand: 'PAYPAL',
          expiryDate: null,
          isDefault: data.isDefault || false,
          userId,
        },
      });
    }

    // For credit cards, validate the details
    const cleanCardNumber = data.cardNumber.replace(/\D/g, '');
    if (!cleanCardNumber || cleanCardNumber.length < 13 || cleanCardNumber.length > 16) {
      throw new Error('Invalid card number');
    }

    // Validate expiry date format (MM/YY)
    const expiryRegex = /^\d{2}\/\d{2}$/;
    if (!expiryRegex.test(data.expiryDate)) {
      throw new Error('Invalid expiry date format. Use MM/YY');
    }

    // Extract last 4 digits
    const lastFourDigits = cleanCardNumber.slice(-4);

    // Determine card brand based on card number pattern
    let cardBrand;
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleanCardNumber)) {
      cardBrand = 'VISA';
    } else if (/^(5[1-5][0-9]{14}|2[2-7][0-9]{14})$/.test(cleanCardNumber)) {
      cardBrand = 'MASTERCARD';
    } else {
      throw new Error('Only VISA and Mastercard are supported');
    }

    // Create payment method
    return this.prisma.paymentMethod.create({
      data: {
        type: data.type,
        cardNumber: lastFourDigits,
        cardBrand,
        expiryDate: data.expiryDate,
        isDefault: data.isDefault || false,
        userId,
      },
    });
  }

  async setDefaultPaymentMethod(userId: string, methodId: string) {
    // First, unset any existing default
    await this.prisma.paymentMethod.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Then set the new default
    return this.prisma.paymentMethod.update({
      where: { id: methodId },
      data: { isDefault: true },
    });
  }

  async deletePaymentMethod(userId: string, methodId: string) {
    return this.prisma.paymentMethod.delete({
      where: { id: methodId },
    });
  }
} 