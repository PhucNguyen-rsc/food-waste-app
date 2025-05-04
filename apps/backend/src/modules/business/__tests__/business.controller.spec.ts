import { Test, TestingModule } from '@nestjs/testing';
import { BusinessController } from '../business.controller';
import { BusinessService } from '../business.service';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { Roles } from '@decorators/roles.decorator';
import { UserRole, FoodStatus, FoodCategory } from '@food-waste/types';
import { TestFactory } from '../../../test/factories/test.factory';

describe('BusinessController', () => {
  let controller: BusinessController;
  let businessService: BusinessService;

  const mockUser = {
    id: 'test-user-id',
    role: UserRole.BUSINESS,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        {
          provide: BusinessService,
          useValue: {
            createFoodItem: jest.fn(),
            findAllFoodItems: jest.fn(),
            findOneFoodItem: jest.fn(),
            updateFoodItem: jest.fn(),
            removeFoodItem: jest.fn(),
            updateFoodItemStatus: jest.fn(),
            getBusinessOrders: jest.fn(),
            getBusinessOrder: jest.fn(),
            updateBusinessDetails: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(Roles)
      .useValue(() => {})
      .compile();

    controller = module.get<BusinessController>(BusinessController);
    businessService = module.get<BusinessService>(BusinessService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createFoodItem', () => {
    it('should create a food item', async () => {
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

      const mockFoodItem = TestFactory.createFoodItem({ ...createDto, business: { connect: { id: mockUser.id } } });
      (businessService.createFoodItem as jest.Mock).mockResolvedValue(mockFoodItem);

      const result = await controller.createFoodItem({ user: mockUser }, createDto);
      expect(result).toEqual(mockFoodItem);
      expect(businessService.createFoodItem).toHaveBeenCalledWith(mockUser.id, createDto);
    });
  });

  describe('findAllFoodItems', () => {
    it('should return all food items', async () => {
      const mockFoodItems = [
        TestFactory.createFoodItem({ business: { connect: { id: mockUser.id } } }),
        TestFactory.createFoodItem({ business: { connect: { id: mockUser.id } } }),
      ];

      (businessService.findAllFoodItems as jest.Mock).mockResolvedValue(mockFoodItems);

      const result = await controller.findAllFoodItems({ user: mockUser });
      expect(result).toEqual(mockFoodItems);
      expect(businessService.findAllFoodItems).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findOneFoodItem', () => {
    it('should return a food item', async () => {
      const foodItemId = 'test-food-id';
      const mockFoodItem = TestFactory.createFoodItem({ id: foodItemId, business: { connect: { id: mockUser.id } } });

      (businessService.findOneFoodItem as jest.Mock).mockResolvedValue(mockFoodItem);

      const result = await controller.findOneFoodItem({ user: mockUser }, foodItemId);
      expect(result).toEqual(mockFoodItem);
      expect(businessService.findOneFoodItem).toHaveBeenCalledWith(mockUser.id, foodItemId);
    });
  });

  describe('updateFoodItem', () => {
    it('should update a food item', async () => {
      const foodItemId = 'test-food-id';
      const updateDto = {
        name: 'Updated Food',
        price: 12.99,
      };

      const mockUpdatedItem = TestFactory.createFoodItem({ id: foodItemId, business: { connect: { id: mockUser.id } }, ...updateDto });
      (businessService.updateFoodItem as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const result = await controller.updateFoodItem({ user: mockUser }, foodItemId, updateDto);
      expect(result).toEqual(mockUpdatedItem);
      expect(businessService.updateFoodItem).toHaveBeenCalledWith(mockUser.id, foodItemId, updateDto);
    });
  });

  describe('removeFoodItem', () => {
    it('should remove a food item', async () => {
      const foodItemId = 'test-food-id';
      const mockDeletedItem = TestFactory.createFoodItem({ id: foodItemId, business: { connect: { id: mockUser.id } } });

      (businessService.removeFoodItem as jest.Mock).mockResolvedValue(mockDeletedItem);

      const result = await controller.removeFoodItem({ user: mockUser }, foodItemId);
      expect(result).toEqual(mockDeletedItem);
      expect(businessService.removeFoodItem).toHaveBeenCalledWith(mockUser.id, foodItemId);
    });
  });

  describe('updateFoodItemStatus', () => {
    it('should update food item status', async () => {
      const foodItemId = 'test-food-id';
      const newStatus = FoodStatus.RESERVED;

      const mockUpdatedItem = TestFactory.createFoodItem({ id: foodItemId, business: { connect: { id: mockUser.id } }, status: newStatus });
      (businessService.updateFoodItemStatus as jest.Mock).mockResolvedValue(mockUpdatedItem);

      const result = await controller.updateFoodItemStatus({ user: mockUser }, foodItemId, newStatus);
      expect(result).toEqual(mockUpdatedItem);
      expect(businessService.updateFoodItemStatus).toHaveBeenCalledWith(mockUser.id, foodItemId, newStatus);
    });
  });

  describe('getBusinessOrders', () => {
    it('should return all orders', async () => {
      const mockOrders = [
        TestFactory.createOrder({ business: { connect: { id: mockUser.id } } }),
        TestFactory.createOrder({ business: { connect: { id: mockUser.id } } }),
      ];

      (businessService.getBusinessOrders as jest.Mock).mockResolvedValue(mockOrders);

      const result = await controller.getBusinessOrders({ user: mockUser });
      expect(result).toEqual(mockOrders);
      expect(businessService.getBusinessOrders).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('getBusinessOrder', () => {
    it('should return a specific order', async () => {
      const orderId = 'test-order-id';
      const mockOrder = TestFactory.createOrder({ id: orderId, business: { connect: { id: mockUser.id } } });

      (businessService.getBusinessOrder as jest.Mock).mockResolvedValue(mockOrder);

      const result = await controller.getBusinessOrder({ user: mockUser }, orderId);
      expect(result).toEqual(mockOrder);
      expect(businessService.getBusinessOrder).toHaveBeenCalledWith(mockUser.id, orderId);
    });
  });

  describe('updateBusinessProfile', () => {
    it('should update business details', async () => {
      const updateDto = {
        businessName: 'Updated Business',
        businessAddress: 'New Address',
        businessPhone: '123-456-7890',
      };

      const mockUpdatedBusiness = TestFactory.createUser({ id: mockUser.id, ...updateDto });
      (businessService.updateBusinessDetails as jest.Mock).mockResolvedValue(mockUpdatedBusiness);

      const result = await controller.updateBusinessProfile({ user: mockUser }, updateDto);
      expect(result).toEqual(mockUpdatedBusiness);
      expect(businessService.updateBusinessDetails).toHaveBeenCalledWith(mockUser.id, updateDto);
    });
  });
}); 