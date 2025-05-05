import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerController } from '../consumer.controller';
import { ConsumerService } from '../consumer.service';
import { OrderStatus } from '@food-waste/types';
import { Request } from 'express';
import { CreateOrderDto } from '../dto/create-order.dto';

describe('ConsumerController', () => {
  let controller: ConsumerController;
  let service: ConsumerService;
  let module: TestingModule;

  const mockConsumerService = {
    getOrders: jest.fn(),
    createOrder: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'consumer123',
      role: 'CONSUMER',
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
      controllers: [ConsumerController],
      providers: [
        {
          provide: ConsumerService,
          useValue: mockConsumerService,
        },
      ],
    }).compile();

    controller = module.get<ConsumerController>(ConsumerController);
    service = module.get<ConsumerService>(ConsumerService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('getOrders', () => {
    const mockOrders = [
      {
        id: 'order1',
        status: OrderStatus.PENDING,
        businessName: 'Test Business',
        totalAmount: 28,
        deliveryAddress: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            name: 'Pizza',
            quantity: 2,
            price: 10,
          },
        ],
      },
    ];

    it('should return orders for the authenticated consumer', async () => {
      mockConsumerService.getOrders.mockResolvedValue(mockOrders);

      const result = await controller.getOrders(mockRequest);

      expect(result).toEqual(mockOrders);
      expect(mockConsumerService.getOrders).toHaveBeenCalledWith('consumer123');
    });
  });

  describe('createOrder', () => {
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

    const mockCreatedOrder = {
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
    };

    it('should create an order for the authenticated consumer', async () => {
      mockConsumerService.createOrder.mockResolvedValue(mockCreatedOrder);

      const result = await controller.createOrder(mockRequest, createOrderDto);

      expect(result).toEqual(mockCreatedOrder);
      expect(mockConsumerService.createOrder).toHaveBeenCalledWith('consumer123', createOrderDto);
    });
  });
}); 