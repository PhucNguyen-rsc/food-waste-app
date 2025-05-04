import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from '../foodItem.controller';
import { ItemService } from '../foodItem.service';
import { TestFactory } from '../../../test/factories/test.factory';

describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;

  const mockFoodItem = TestFactory.createFoodItem();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a food item', async () => {
      const createData = {
        name: 'Test Food',
        description: 'Test Description',
        price: 10.99,
        businessId: 'test-business-id',
      };

      (service.create as jest.Mock).mockResolvedValue(mockFoodItem);

      const result = await controller.create(createData);

      expect(service.create).toHaveBeenCalledWith(createData);
      expect(result).toEqual(mockFoodItem);
    });

    it('should handle creation errors', async () => {
      const createData = {
        name: 'Test Food',
        description: 'Test Description',
        price: 10.99,
        businessId: 'test-business-id',
      };

      const error = new Error('Creation failed');
      (service.create as jest.Mock).mockRejectedValue(error);

      await expect(controller.create(createData)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all food items', async () => {
      const mockItems = [mockFoodItem, TestFactory.createFoodItem()];

      (service.findAll as jest.Mock).mockResolvedValue(mockItems);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockItems);
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Fetch failed');
      (service.findAll as jest.Mock).mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
    });
  });
}); 