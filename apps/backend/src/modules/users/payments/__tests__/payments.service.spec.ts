import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '../payments.service';
import { PrismaService } from '@prisma/prisma.service';
import { UsersService } from '../../users.service';
import { PaymentType } from '@food-waste/types';
import { NotFoundException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: PrismaService;
  let usersService: UsersService;
  let module: TestingModule;

  const mockPrismaService = {
    paymentMethod: {
      findMany: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUsersService = {
    findByFirebaseUid: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('getPaymentMethods', () => {
    it('should return payment methods for a user', async () => {
      const userId = 'user123';
      const mockPaymentMethods = [
        { id: '1', type: PaymentType.VISA, cardNumber: '1234' },
        { id: '2', type: PaymentType.PAYPAL },
      ];

      mockPrismaService.paymentMethod.findMany.mockResolvedValue(mockPaymentMethods);

      const result = await service.getPaymentMethods(userId);

      expect(result).toEqual(mockPaymentMethods);
      expect(mockPrismaService.paymentMethod.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { isDefault: 'desc' },
      });
    });
  });

  describe('addPaymentMethod', () => {
    const userId = 'user123';
    const mockUser = { id: userId, name: 'Test User' };

    beforeEach(() => {
      mockUsersService.findByFirebaseUid.mockResolvedValue(mockUser);
    });

    it('should add a PayPal payment method', async () => {
      const paypalData = {
        type: PaymentType.PAYPAL,
        cardNumber: null,
        expiryDate: null,
        isDefault: true,
      };

      const mockPaypalMethod = {
        id: '1',
        type: PaymentType.PAYPAL,
        cardBrand: 'PAYPAL',
        isDefault: true,
      };

      mockPrismaService.paymentMethod.create.mockResolvedValue(mockPaypalMethod);

      const result = await service.addPaymentMethod(userId, paypalData);

      expect(result).toEqual(mockPaypalMethod);
      expect(mockPrismaService.paymentMethod.create).toHaveBeenCalledWith({
        data: {
          type: PaymentType.PAYPAL,
          cardNumber: null,
          cardBrand: 'PAYPAL',
          expiryDate: null,
          isDefault: true,
          userId,
        },
      });
    });

    it('should add a valid credit card payment method', async () => {
      const cardData = {
        type: PaymentType.VISA,
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        isDefault: false,
      };

      const mockCardMethod = {
        id: '1',
        type: PaymentType.VISA,
        cardNumber: '1111',
        cardBrand: 'VISA',
        expiryDate: '12/25',
        isDefault: false,
      };

      mockPrismaService.paymentMethod.create.mockResolvedValue(mockCardMethod);

      const result = await service.addPaymentMethod(userId, cardData);

      expect(result).toEqual(mockCardMethod);
      expect(mockPrismaService.paymentMethod.create).toHaveBeenCalledWith({
        data: {
          type: PaymentType.VISA,
          cardNumber: '1111',
          cardBrand: 'VISA',
          expiryDate: '12/25',
          isDefault: false,
          userId,
        },
      });
    });

    it('should throw error for invalid card number', async () => {
      const invalidCardData = {
        type: PaymentType.VISA,
        cardNumber: '123',
        expiryDate: '12/25',
      };

      await expect(service.addPaymentMethod(userId, invalidCardData)).rejects.toThrow('Invalid card number');
    });

    it('should throw error for invalid expiry date format', async () => {
      const invalidExpiryData = {
        type: PaymentType.VISA,
        cardNumber: '4111111111111111',
        expiryDate: '12-25',
      };

      await expect(service.addPaymentMethod(userId, invalidExpiryData)).rejects.toThrow('Invalid expiry date format');
    });

    it('should throw error for unsupported card type', async () => {
      const unsupportedCardData = {
        type: PaymentType.VISA,
        cardNumber: '6011111111111111', // Discover card
        expiryDate: '12/25',
      };

      await expect(service.addPaymentMethod(userId, unsupportedCardData)).rejects.toThrow('Only VISA and Mastercard are supported');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUsersService.findByFirebaseUid.mockResolvedValue(null);

      const cardData = {
        type: PaymentType.VISA,
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
      };

      await expect(service.addPaymentMethod(userId, cardData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('setDefaultPaymentMethod', () => {
    it('should set a payment method as default', async () => {
      const userId = 'user123';
      const methodId = 'method123';
      const mockUpdatedMethod = {
        id: methodId,
        isDefault: true,
      };

      mockPrismaService.paymentMethod.update.mockResolvedValue(mockUpdatedMethod);

      const result = await service.setDefaultPaymentMethod(userId, methodId);

      expect(result).toEqual(mockUpdatedMethod);
      expect(mockPrismaService.paymentMethod.updateMany).toHaveBeenCalledWith({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
      expect(mockPrismaService.paymentMethod.update).toHaveBeenCalledWith({
        where: { id: methodId },
        data: { isDefault: true },
      });
    });
  });

  describe('deletePaymentMethod', () => {
    it('should delete a payment method', async () => {
      const userId = 'user123';
      const methodId = 'method123';
      const mockDeletedMethod = {
        id: methodId,
      };

      mockPrismaService.paymentMethod.delete.mockResolvedValue(mockDeletedMethod);

      const result = await service.deletePaymentMethod(userId, methodId);

      expect(result).toEqual(mockDeletedMethod);
      expect(mockPrismaService.paymentMethod.delete).toHaveBeenCalledWith({
        where: { id: methodId },
      });
    });
  });
}); 