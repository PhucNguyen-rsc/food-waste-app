import { Test, TestingModule } from '@nestjs/testing';
import { CourierService } from '../courier.service';
import { PrismaService } from '@prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@food-waste/types';

describe('CourierService', () => {
  let service: CourierService;
  let prismaService: PrismaService;
  let module: TestingModule;

  const mockPrismaService = {
    order: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CourierService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CourierService>(CourierService);
    prismaService = module.get<PrismaService>(PrismaService);
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
        consumer: {
          id: 'consumer1',
          name: 'John Doe',
          image: 'profile.jpg',
        },
        business: {
          id: 'business1',
          name: 'Restaurant A',
          businessAddress: '123 Main St',
        },
        totalAmount: 100,
      },
    ];

    it('should return formatted new delivery requests', async () => {
      mockPrismaService.order.findMany.mockResolvedValue(mockRequests);

      const result = await service.getNewRequests('courier1');

      expect(result).toEqual([
        {
          id: 'order1',
          customerName: 'John Doe',
          customerPhotoUrl: 'profile.jpg',
          distanceKm: 5,
          pickupAddress: '123 Main St',
          rewardAed: 20,
        },
      ]);

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        where: {
          status: OrderStatus.PENDING,
          courierId: null,
        },
        include: {
          consumer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
              businessAddress: true,
            },
          },
        },
      });
    });
  });

  describe('getStats', () => {
    it('should return courier statistics with zero earnings', async () => {
      mockPrismaService.order.count.mockResolvedValue(0);
      mockPrismaService.order.aggregate.mockResolvedValue({
        _sum: { totalAmount: null },
      });

      const result = await service.getStats('courier1');

      expect(result).toEqual({
        completed: 0,
        earnings: 0,
        rating: 4.5,
      });
    });

    it('should return courier statistics with earnings', async () => {
      mockPrismaService.order.count.mockResolvedValue(10);
      mockPrismaService.order.aggregate.mockResolvedValue({
        _sum: { totalAmount: 1000 },
      });

      const result = await service.getStats('courier1');

      expect(result).toEqual({
        completed: 10,
        earnings: 200,
        rating: 4.5,
      });
    });
  });

  describe('getActiveDelivery', () => {
    const mockDelivery = {
      id: 'order1',
      status: OrderStatus.CONFIRMED,
      consumer: {
        id: 'consumer1',
        name: 'John Doe',
        email: 'john@example.com',
      },
      business: {
        id: 'business1',
        name: 'Restaurant A',
        businessAddress: '123 Main St',
      },
      deliveryAddress: '456 Home St',
    };

    it('should return active delivery details', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(mockDelivery);

      const result = await service.getActiveDelivery('courier1');

      expect(result).toEqual({
        id: 'order1',
        orderId: 'order1',
        pickupAddress: '123 Main St',
        deliveryAddress: '456 Home St',
        status: OrderStatus.CONFIRMED,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        estimatedTime: '30 mins',
      });
    });

    it('should return null when no active delivery exists', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      const result = await service.getActiveDelivery('courier1');

      expect(result).toBeNull();
    });
  });

  describe('updateDeliveryStatus', () => {
    const mockDelivery = {
      id: 'order1',
      status: OrderStatus.CONFIRMED,
      business: {
        name: 'Restaurant A',
      },
    };

    it('should update delivery status to PICKED_UP', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(mockDelivery);
      mockPrismaService.order.update.mockResolvedValue({
        ...mockDelivery,
        status: OrderStatus.PICKED_UP,
      });

      const result = await service.updateDeliveryStatus('courier1', 'order1', OrderStatus.PICKED_UP);

      expect(result).toEqual({
        id: 'order1',
        status: OrderStatus.PICKED_UP,
        businessName: 'Restaurant A',
        completedAt: undefined,
      });
    });

    it('should update delivery status to COURIER_DELIVERED with completedAt', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue({
        ...mockDelivery,
        status: OrderStatus.PICKED_UP,
      });
      mockPrismaService.order.update.mockResolvedValue({
        ...mockDelivery,
        status: OrderStatus.COURIER_DELIVERED,
        completedAt: new Date('2024-03-20T12:00:00.000Z'),
      });

      const result = await service.updateDeliveryStatus('courier1', 'order1', OrderStatus.COURIER_DELIVERED);

      expect(result).toEqual({
        id: 'order1',
        status: OrderStatus.COURIER_DELIVERED,
        businessName: 'Restaurant A',
        completedAt: '2024-03-20T12:00:00.000Z',
      });
    });

    it('should throw NotFoundException when delivery not found', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(
        service.updateDeliveryStatus('courier1', 'order1', OrderStatus.PICKED_UP),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error for invalid status transition from CONFIRMED to DELIVERED', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(mockDelivery);

      await expect(
        service.updateDeliveryStatus('courier1', 'order1', OrderStatus.DELIVERED),
      ).rejects.toThrow('Invalid status transition');
    });

    it('should throw error for invalid status transition from PENDING to PICKED_UP', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue({
        ...mockDelivery,
        status: OrderStatus.PENDING,
      });

      await expect(
        service.updateDeliveryStatus('courier1', 'order1', OrderStatus.PICKED_UP),
      ).rejects.toThrow('Invalid status transition');
    });
  });

  describe('getProfile', () => {
    const mockCourier = {
      id: 'courier1',
      name: 'John Doe',
      email: 'john@example.com',
      image: 'profile.jpg',
    };

    it('should return courier profile', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockCourier);

      const result = await service.getProfile('courier1');

      expect(result).toEqual({
        id: 'courier1',
        name: 'John Doe',
        email: 'john@example.com',
        avatarUrl: 'profile.jpg',
      });
    });

    it('should throw NotFoundException when courier not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile('courier1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getHistory', () => {
    const mockDeliveries = [
      {
        id: 'order1',
        status: OrderStatus.COURIER_DELIVERED,
        consumer: {
          name: 'John Doe',
        },
        business: {
          businessAddress: '123 Main St',
        },
        deliveryAddress: '456 Home St',
        updatedAt: new Date('2024-03-20T12:00:00.000Z'),
        totalAmount: 100,
      },
      {
        id: 'order2',
        status: OrderStatus.CONFIRMED,
        consumer: {
          name: 'Jane Smith',
        },
        business: {
          businessAddress: '789 Business St',
        },
        deliveryAddress: '101 Home St',
        updatedAt: new Date('2024-03-19T12:00:00.000Z'),
        totalAmount: 150,
      },
    ];

    it('should return formatted delivery history with completedAt for delivered orders', async () => {
      mockPrismaService.order.findMany.mockResolvedValue(mockDeliveries);

      const result = await service.getHistory('courier1');

      expect(result).toEqual([
        {
          id: 'order1',
          orderId: 'order1',
          status: OrderStatus.COURIER_DELIVERED,
          customerName: 'John Doe',
          pickupAddress: '123 Main St',
          deliveryAddress: '456 Home St',
          completedAt: '2024-03-20T12:00:00.000Z',
          totalAmount: 100,
        },
        {
          id: 'order2',
          orderId: 'order2',
          status: OrderStatus.CONFIRMED,
          customerName: 'Jane Smith',
          pickupAddress: '789 Business St',
          deliveryAddress: '101 Home St',
          completedAt: undefined,
          totalAmount: 150,
        },
      ]);
    });
  });

  describe('getEarnings', () => {
    const mockDeliveries = [
      {
        id: 'order1',
        totalAmount: 100,
        status: OrderStatus.COURIER_DELIVERED,
        updatedAt: new Date('2024-03-20T12:00:00Z'),
      },
      {
        id: 'order2',
        totalAmount: 150,
        status: OrderStatus.DELIVERED,
        updatedAt: new Date('2024-03-19T12:00:00Z'),
      },
    ];

    it('should return formatted earnings data', async () => {
      mockPrismaService.order.findMany.mockResolvedValue(mockDeliveries);

      const result = await service.getEarnings('courier1');

      expect(result).toEqual({
        entries: [
          {
            id: '2024-03-20',
            date: '2024-03-20',
            amount: 20,
            deliveryCount: 1,
          },
          {
            id: '2024-03-19',
            date: '2024-03-19',
            amount: 30,
            deliveryCount: 1,
          },
        ],
        total: 50,
      });
    });
  });

  describe('acceptDelivery', () => {
    const mockDelivery = {
      id: 'order1',
      status: OrderStatus.PENDING,
      courierId: null,
      business: {
        name: 'Restaurant A',
      },
    };

    it('should accept delivery request successfully', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(mockDelivery);
      mockPrismaService.order.update.mockResolvedValue({
        ...mockDelivery,
        status: OrderStatus.CONFIRMED,
        courierId: 'courier1',
      });

      const result = await service.acceptDelivery('courier1', 'order1');

      expect(result).toEqual({
        id: 'order1',
        status: OrderStatus.CONFIRMED,
        courierId: 'courier1',
        business: {
          name: 'Restaurant A',
        },
      });
    });

    it('should throw NotFoundException when delivery not found', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.acceptDelivery('courier1', 'order1')).rejects.toThrow(
        'Delivery with ID order1 not found or not available',
      );
    });

    it('should throw NotFoundException when delivery is not in PENDING status', async () => {
      mockPrismaService.order.findFirst.mockResolvedValue(null);

      await expect(service.acceptDelivery('courier1', 'order1')).rejects.toThrow(
        'Delivery with ID order1 not found or not available',
      );
    });
  });
}); 