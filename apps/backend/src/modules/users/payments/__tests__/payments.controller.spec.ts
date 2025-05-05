import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../payments.controller';
import { PaymentsService } from '../payments.service';
import { PaymentType } from '@food-waste/types';
import { NotFoundException } from '@nestjs/common';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;
  let module: TestingModule;

  const mockPaymentsService = {
    getPaymentMethods: jest.fn(),
    addPaymentMethod: jest.fn(),
    setDefaultPaymentMethod: jest.fn(),
    deletePaymentMethod: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user123',
      name: 'Test User',
    },
    body: {},
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('getPaymentMethods', () => {
    it('should return payment methods for authenticated user', async () => {
      const mockPaymentMethods = [
        { id: '1', type: PaymentType.VISA, cardNumber: '1234' },
        { id: '2', type: PaymentType.PAYPAL },
      ];

      mockPaymentsService.getPaymentMethods.mockResolvedValue(mockPaymentMethods);

      await controller.getPaymentMethods(mockRequest as any, mockResponse as any);

      expect(mockPaymentsService.getPaymentMethods).toHaveBeenCalledWith('user123');
      expect(mockResponse.json).toHaveBeenCalledWith(mockPaymentMethods);
    });

    it('should handle unauthorized requests', async () => {
      const unauthorizedRequest = { user: null };

      await controller.getPaymentMethods(unauthorizedRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized - No user ID found' });
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockPaymentsService.getPaymentMethods.mockRejectedValue(error);

      await controller.getPaymentMethods(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Failed to fetch payment methods',
        error: 'Service error',
      });
    });
  });

  describe('addPaymentMethod', () => {
    it('should add a payment method for authenticated user', async () => {
      const paymentData = {
        type: PaymentType.VISA,
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
      };

      const mockPaymentMethod = {
        id: '1',
        type: PaymentType.VISA,
        cardNumber: '1111',
        cardBrand: 'VISA',
      };

      mockRequest.body = paymentData;
      mockPaymentsService.addPaymentMethod.mockResolvedValue(mockPaymentMethod);

      await controller.addPaymentMethod(mockRequest as any, mockResponse as any);

      expect(mockPaymentsService.addPaymentMethod).toHaveBeenCalledWith('user123', paymentData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockPaymentMethod);
    });

    it('should handle unauthorized requests', async () => {
      const unauthorizedRequest = { user: null };

      await controller.addPaymentMethod(unauthorizedRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized - No user ID found' });
    });

    it('should handle not found errors', async () => {
      const paymentData = {
        type: PaymentType.VISA,
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
      };

      mockRequest.body = paymentData;
      mockPaymentsService.addPaymentMethod.mockRejectedValue(new NotFoundException('User not found'));

      await controller.addPaymentMethod(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle other errors', async () => {
      const paymentData = {
        type: PaymentType.VISA,
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
      };

      mockRequest.body = paymentData;
      mockPaymentsService.addPaymentMethod.mockRejectedValue(new Error('Invalid card'));

      await controller.addPaymentMethod(mockRequest as any, mockResponse as any);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Failed to add payment method' });
    });
  });

  describe('setDefaultPaymentMethod', () => {
    it('should set a payment method as default', async () => {
      const methodId = 'method123';
      const mockUpdatedMethod = {
        id: methodId,
        isDefault: true,
      };

      mockPaymentsService.setDefaultPaymentMethod.mockResolvedValue(mockUpdatedMethod);

      await controller.setDefaultPaymentMethod(mockRequest as any, mockResponse as any, methodId);

      expect(mockPaymentsService.setDefaultPaymentMethod).toHaveBeenCalledWith('user123', methodId);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedMethod);
    });

    it('should handle unauthorized requests', async () => {
      const unauthorizedRequest = { user: null };

      await controller.setDefaultPaymentMethod(unauthorizedRequest as any, mockResponse as any, 'method123');

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should handle service errors', async () => {
      mockPaymentsService.setDefaultPaymentMethod.mockRejectedValue(new Error('Service error'));

      await controller.setDefaultPaymentMethod(mockRequest as any, mockResponse as any, 'method123');

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Failed to set default payment method' });
    });
  });

  describe('deletePaymentMethod', () => {
    it('should delete a payment method', async () => {
      const methodId = 'method123';

      mockPaymentsService.deletePaymentMethod.mockResolvedValue({ id: methodId });

      await controller.deletePaymentMethod(mockRequest as any, mockResponse as any, methodId);

      expect(mockPaymentsService.deletePaymentMethod).toHaveBeenCalledWith('user123', methodId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle unauthorized requests', async () => {
      const unauthorizedRequest = { user: null };

      await controller.deletePaymentMethod(unauthorizedRequest as any, mockResponse as any, 'method123');

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should handle service errors', async () => {
      mockPaymentsService.deletePaymentMethod.mockRejectedValue(new Error('Service error'));

      await controller.deletePaymentMethod(mockRequest as any, mockResponse as any, 'method123');

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Failed to delete payment method' });
    });
  });
}); 