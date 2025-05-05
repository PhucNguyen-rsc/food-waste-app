import { Test, TestingModule } from '@nestjs/testing';
import { CourierController } from '../courier.controller';
import { CourierService } from '../courier.service';
import { OrderStatus } from '@food-waste/types';
import { Request } from 'express';

describe('CourierController', () => {
  let controller: CourierController;
  let service: CourierService;
  let module: TestingModule;

  const mockCourierService = {
    getNewRequests: jest.fn(),
    getStats: jest.fn(),
    getActiveDelivery: jest.fn(),
    updateDeliveryStatus: jest.fn(),
    getHistory: jest.fn(),
    getProfile: jest.fn(),
    getEarnings: jest.fn(),
    acceptDelivery: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'courier123',
      role: 'COURIER',
    },
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
  } as unknown as Request;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [CourierController],
      providers: [
        {
          provide: CourierService,
          useValue: mockCourierService,
        },
      ],
    }).compile();

    controller = module.get<CourierController>(CourierController);
    service = module.get<CourierService>(CourierService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('getNewRequests', () => {
    const mockRequests = [
      {
        id: 'order1',
        customerName: 'John Doe',
        customerPhotoUrl: 'profile.jpg',
        distanceKm: 5,
        pickupAddress: '123 Main St',
        rewardAed: 20,
      },
    ];

    it('should return new delivery requests', async () => {
      mockCourierService.getNewRequests.mockResolvedValue(mockRequests);

      const result = await controller.getNewRequests(mockRequest);

      expect(result).toEqual(mockRequests);
      expect(mockCourierService.getNewRequests).toHaveBeenCalledWith('courier123');
    });
  });

  describe('getStats', () => {
    const mockStats = {
      completed: 10,
      earnings: 200,
      rating: 4.5,
    };

    it('should return courier statistics', async () => {
      mockCourierService.getStats.mockResolvedValue(mockStats);

      const result = await controller.getStats(mockRequest);

      expect(result).toEqual(mockStats);
      expect(mockCourierService.getStats).toHaveBeenCalledWith('courier123');
    });
  });

  describe('getActiveDelivery', () => {
    const mockDelivery = {
      id: 'order1',
      orderId: 'order1',
      pickupAddress: '123 Main St',
      deliveryAddress: '456 Home St',
      status: OrderStatus.CONFIRMED,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      estimatedTime: '30 mins',
    };

    it('should return active delivery details', async () => {
      mockCourierService.getActiveDelivery.mockResolvedValue(mockDelivery);

      const result = await controller.getActiveDelivery(mockRequest);

      expect(result).toEqual(mockDelivery);
      expect(mockCourierService.getActiveDelivery).toHaveBeenCalledWith('courier123');
    });
  });

  describe('updateDeliveryStatus', () => {
    const mockUpdatedDelivery = {
      id: 'order1',
      status: OrderStatus.PICKED_UP,
      businessName: 'Restaurant A',
    };

    it('should update delivery status', async () => {
      mockCourierService.updateDeliveryStatus.mockResolvedValue(mockUpdatedDelivery);

      const result = await controller.updateDeliveryStatus(
        mockRequest,
        'order1',
        OrderStatus.PICKED_UP,
      );

      expect(result).toEqual(mockUpdatedDelivery);
      expect(mockCourierService.updateDeliveryStatus).toHaveBeenCalledWith(
        'courier123',
        'order1',
        OrderStatus.PICKED_UP,
      );
    });
  });

  describe('getHistory', () => {
    const mockHistory = [
      {
        id: 'order1',
        orderId: 'order1',
        status: OrderStatus.DELIVERED,
        customerName: 'John Doe',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Home St',
        completedAt: '2024-03-20T12:00:00Z',
        totalAmount: 100,
      },
    ];

    it('should return delivery history', async () => {
      mockCourierService.getHistory.mockResolvedValue(mockHistory);

      const result = await controller.getHistory(mockRequest);

      expect(result).toEqual(mockHistory);
      expect(mockCourierService.getHistory).toHaveBeenCalledWith('courier123');
    });
  });

  describe('getProfile', () => {
    const mockProfile = {
      id: 'courier123',
      name: 'John Doe',
      email: 'john@example.com',
      avatarUrl: 'profile.jpg',
    };

    it('should return courier profile', async () => {
      mockCourierService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockProfile);
      expect(mockCourierService.getProfile).toHaveBeenCalledWith('courier123');
    });
  });

  describe('acceptDelivery', () => {
    const mockAcceptedDelivery = {
      id: 'order1',
      status: OrderStatus.CONFIRMED,
      courierId: 'courier123',
    };

    it('should accept delivery request', async () => {
      mockCourierService.acceptDelivery.mockResolvedValue(mockAcceptedDelivery);

      const result = await controller.acceptDelivery(mockRequest, 'order1');

      expect(result).toEqual(mockAcceptedDelivery);
      expect(mockCourierService.acceptDelivery).toHaveBeenCalledWith('courier123', 'order1');
    });
  });
});