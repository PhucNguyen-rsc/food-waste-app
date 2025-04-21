import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { UserRole } from '@food-waste/types';
import { PaymentType } from '@food-waste/database';
import { UsersService } from '../users.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
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
    let user = await this.usersService.findByFirebaseUid(userId);
    if (!user) {
      // If user doesn't exist, try to find them by email
      const firebaseUser = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });
      
      if (!firebaseUser || !firebaseUser.email) {
        throw new NotFoundException('User not found');
      }

      // Create the user if they don't exist
      user = await this.usersService.create({
        id: userId,
        email: firebaseUser.email,
        role: UserRole.CONSUMER, // Use the exact enum value from Prisma schema
      });
    }

    // Validate card number
    if (!data.cardNumber || data.cardNumber.length < 4) {
      throw new Error('Invalid card number');
    }

    // Validate expiry date format (MM/YY)
    const expiryRegex = /^\d{2}\/\d{2}$/;
    if (!expiryRegex.test(data.expiryDate)) {
      throw new Error('Invalid expiry date format. Use MM/YY');
    }

    // Extract last 4 digits
    const lastFourDigits = data.cardNumber.slice(-4);

    // Determine card brand based on first digit
    const cardBrand = data.cardNumber.startsWith('4') ? 'VISA' : 
                     data.cardNumber.startsWith('5') ? 'MASTERCARD' : null;

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
    // First, set all payment methods to non-default
    await this.prisma.paymentMethod.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Then set the specified method as default
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