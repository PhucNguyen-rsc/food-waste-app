import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerService } from '../consumer.service';
import { PrismaService } from '@prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '@food-waste/types';
import { CreateOrderDto } from '../dto/create-order.dto';

describe('ConsumerService', () => {
  let service: ConsumerService;
  let prismaService: PrismaService;
  let module: TestingModule;

  const mockPrismaService = {
    foodItem: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        ConsumerService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ConsumerService>(ConsumerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('createOrder', () => {
    const consumerId = 'consumer123';
    const createOrderDto: CreateOrderDto = {
      items: [
        { foodItemId: 'food1', quantity: 2 },
        { foodItemId: 'food2', quantity: 1 },
      ],
      deliveryAddress: '123 Main St',
      customerName: 'John Doe',
      phoneNumber: '+1234567890',
      paymentMethod: 'Cash',
    };

    const mockFoodItems = [
      {
        id: 'food1',
        name: 'Pizza',
        price: 10,
        quantity: 5,
        businessId: 'business1',
      },
      {
        id: 'food2',
        name: 'Burger',
        price: 8,
        quantity: 3,
        businessId: 'business1',
      },
    ];

    it('should create orders successfully', async () => {
      mockPrismaService.foodItem.findMany.mockResolvedValue(mockFoodItems);
      mockPrismaService.order.create.mockResolvedValue({
        id: 'order1',
        status: OrderStatus.PENDING,
        totalAmount: 28,
        items: [
          { foodItemId: 'food1', quantity: 2, price: 10 },
          { foodItemId: 'food2', quantity: 1, price: 8 },
        ],
        business: {
          name: 'Test Business',
          businessAddress: '456 Business St',
        },
      });

      const result = await service.createOrder(consumerId, createOrderDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.foodItem.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ['food1', 'food2'],
          },
        },
      });
      expect(mockPrismaService.order.create).toHaveBeenCalled();
      expect(mockPrismaService.foodItem.update).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException when food items not found', async () => {
      mockPrismaService.foodItem.findMany.mockResolvedValue([mockFoodItems[0]]);

      await expect(service.createOrder(consumerId, createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when quantity is insufficient', async () => {
      const insufficientFoodItems = [
        {
          ...mockFoodItems[0],
          quantity: 1, // Less than requested quantity
        },
        mockFoodItems[1],
      ];

      mockPrismaService.foodItem.findMany.mockResolvedValue(insufficientFoodItems);

      await expect(service.createOrder(consumerId, createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getOrders', () => {
    const consumerId = 'consumer123';
    const mockOrders = [
      {
        id: 'order1',
        status: OrderStatus.PENDING,
        totalAmount: 28,
        deliveryAddress: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date(),
        business: {
          businessName: 'Test Business',
          businessAddress: '456 Business St',
        },
        items: [
          {
            foodItem: {
              name: 'Pizza',
              price: 10,
            },
            quantity: 2,
            price: 10,
          },
        ],
      },
    ];

    it('should return formatted orders', async () => {
      mockPrismaService.order.findMany.mockResolvedValue(mockOrders);

      const result = await service.getOrders(consumerId);

      expect(result).toEqual([
        {
          id: 'order1',
          status: OrderStatus.PENDING,
          businessName: 'Test Business',
          totalAmount: 28,
          deliveryAddress: '123 Main St',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          items: [
            {
              name: 'Pizza',
              quantity: 2,
              price: 10,
            },
          ],
        },
      ]);

      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith({
        where: { consumerId },
        include: {
          business: {
            select: {
              businessName: true,
              businessAddress: true,
            },
          },
          items: {
            include: {
              foodItem: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });
}); 