import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from '../business.service';
import { PrismaService } from '@prisma/prisma.service';
import { TestFactory } from '../../../test/factories/test.factory';
import { NotFoundException } from '@nestjs/common';
import { FoodStatus, FoodCategory } from '@food-waste/types';

describe('BusinessService', () => {
  let service: BusinessService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        {
          provide: PrismaService,
          useValue: {
            foodItem: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            order: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
            },
            user: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BusinessService>(BusinessService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFoodItem', () => {
    it('should create a food item', async () => {
      const businessId = 'test-business-id';
      const createDto = {
        name: 'Test Food',
        description: 'Test Description',
        price: 10.99,
        originalPrice: 15.99,
        quantity: 5,
        expiryDate: new Date(),
        images: ['test.jpg'],
        category: FoodCategory.MEAT,
      };

      const mockFoodItem = TestFactory.createFoodItem({ ...createDto, business: { connect: { id: businessId } } });
      (prismaService.foodItem.create as jest.Mock).mockResolvedValue(mockFoodItem);

      const result = await service.createFoodItem(businessId, createDto);
      expect(result).toEqual(mockFoodItem);
      expect(prismaService.foodItem.create).toHaveBeenCalledWith({
        data: { ...createDto, businessId },
      });
    });
  });

  describe('findAllFoodItems', () => {
    it('should return all food items for a business', async () => {
      const businessId = 'test-business-id';
      const mockFoodItems = [
        TestFactory.createFoodItem({ business: { connect: { id: businessId } } }),
        TestFactory.createFoodItem({ business: { connect: { id: businessId } } }),
      ];

      (prismaService.foodItem.findMany as jest.Mock).mockResolvedValue(mockFoodItems);

      const result = await service.findAllFoodItems(businessId);
      expect(result).toEqual(mockFoodItems);
      expect(prismaService.foodItem.findMany).toHaveBeenCalledWith({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOneFoodItem', () => {
    it('should return a food item if found', async () => {
      const businessId = 'test-business-id';
      const foodItemId = 'test-food-id';
      const mockFoodItem = TestFactory.createFoodItem({ id: foodItemId, business: { connect: { id: businessId } } });

      (prismaService.foodItem.findFirst as jest.Mock).mockResolvedValue(mockFoodItem);

      const result = await service.findOneFoodItem(businessId, foodItemId);
      expect(result).toEqual(mockFoodItem);
    });

    it('should throw NotFoundException if food item not found', async () => {
      const businessId = 'test-business-id';
      const foodItemId = 'non-existent-id';

      (prismaService.foodItem.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.findOneFoodItem(businessId, foodItemId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateFoodItem', () => {
    it('should update a food item', async () => {
      const businessId = 'test-business-id';
      const foodItemId = 'test-food-id';
      const updateDto = {
        name: 'Updated Food',
        price: 12.99,
      };

      const mockUpdatedItem = TestFactory.createFoodItem({ id: foodItemId, business: { connect: { id: businessId } }, ...updateDto });
      (prismaService.foodItem.update as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const result = await service.updateFoodItem(businessId, foodItemId, updateDto);
      expect(result).toEqual(mockUpdatedItem);
    });

    it('should throw NotFoundException if food item not found', async () => {
      const businessId = 'test-business-id';
      const foodItemId = 'non-existent-id';
      const updateDto = { name: 'Updated Food' };

      (prismaService.foodItem.update as jest.Mock).mockRejectedValue(new Error());

      await expect(service.updateFoodItem(businessId, foodItemId, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFoodItem', () => {
    it('should remove a food item', async () => {
      const businessId = 'test-business-id';
      const foodItemId = 'test-food-id';
      const mockDeletedItem = TestFactory.createFoodItem({ id: foodItemId, business: { connect: { id: businessId } } });

      (prismaService.foodItem.delete as jest.Mock).mockResolvedValue(mockDeletedItem);

      const result = await service.removeFoodItem(businessId, foodItemId);
      expect(result).toEqual(mockDeletedItem);
    });

    it('should throw NotFoundException if food item not found', async () => {
      const businessId = 'test-business-id';
      const foodItemId = 'non-existent-id';

      (prismaService.foodItem.delete as jest.Mock).mockRejectedValue(new Error());

      await expect(service.removeFoodItem(businessId, foodItemId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateFoodItemStatus', () => {
    it('should update food item status', async () => {
      const businessId = 'test-business-id';
      const foodItemId = 'test-food-id';
      const newStatus = FoodStatus.RESERVED;

      const mockUpdatedItem = TestFactory.createFoodItem({ id: foodItemId, business: { connect: { id: businessId } }, status: newStatus });
      (prismaService.foodItem.update as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const result = await service.updateFoodItemStatus(businessId, foodItemId, newStatus);
      expect(result).toEqual(mockUpdatedItem);
    });

    it('should throw NotFoundException if food item not found', async () => {
      const businessId = 'test-business-id';
      const foodItemId = 'non-existent-id';
      const newStatus = FoodStatus.RESERVED;

      (prismaService.foodItem.update as jest.Mock).mockRejectedValue(new Error());

      await expect(service.updateFoodItemStatus(businessId, foodItemId, newStatus)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getBusinessOrders', () => {
    it('should return all orders for a business', async () => {
      const businessId = 'test-business-id';
      const mockOrders = [
        TestFactory.createOrder({ business: { connect: { id: businessId } } }),
        TestFactory.createOrder({ business: { connect: { id: businessId } } }),
      ];

      (prismaService.order.findMany as jest.Mock).mockResolvedValue(mockOrders);

      const result = await service.getBusinessOrders(businessId);
      expect(result).toEqual(mockOrders);
      expect(prismaService.order.findMany).toHaveBeenCalledWith({
        where: { businessId },
        include: {
          consumer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          courier: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              foodItem: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getBusinessOrder', () => {
    it('should return a specific order if found', async () => {
      const businessId = 'test-business-id';
      const orderId = 'test-order-id';
      const mockOrder = TestFactory.createOrder({ id: orderId, business: { connect: { id: businessId } } });

      (prismaService.order.findFirst as jest.Mock).mockResolvedValue(mockOrder);

      const result = await service.getBusinessOrder(businessId, orderId);
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order not found', async () => {
      const businessId = 'test-business-id';
      const orderId = 'non-existent-id';

      (prismaService.order.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.getBusinessOrder(businessId, orderId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBusinessDetails', () => {
    it('should update business details', async () => {
      const businessId = 'test-business-id';
      const updateDto = {
        businessName: 'Updated Business',
        businessAddress: 'New Address',
        businessPhone: '123-456-7890',
      };

      const mockUpdatedBusiness = TestFactory.createUser({ id: businessId, ...updateDto });
      (prismaService.user.update as jest.Mock).mockResolvedValue(mockUpdatedBusiness);

      const result = await service.updateBusinessDetails(businessId, updateDto);
      expect(result).toEqual(mockUpdatedBusiness);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: businessId },
        data: updateDto,
      });
    });
  });
}); 