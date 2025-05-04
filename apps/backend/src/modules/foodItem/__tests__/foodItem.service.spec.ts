import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from '../foodItem.service';
import { PrismaService } from '@prisma/prisma.service';
import { TestFactory } from '../../../test/factories/test.factory';

describe('ItemService', () => {
  let service: ItemService;
  let prismaService: PrismaService;

  const mockFoodItem = TestFactory.createFoodItem();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: PrismaService,
          useValue: {
            foodItem: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a food item successfully', async () => {
      const createData = {
        name: 'Test Food',
        description: 'Test Description',
        price: 10.99,
        businessId: 'test-business-id',
      };

      (prismaService.foodItem.create as jest.Mock).mockResolvedValue(mockFoodItem);

      const result = await service.create(createData);

      expect(prismaService.foodItem.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toEqual(mockFoodItem);
    });

    it('should throw an error when creation fails', async () => {
      const createData = {
        name: 'Test Food',
        description: 'Test Description',
        price: 10.99,
        businessId: 'test-business-id',
      };

      const error = new Error('Database error');
      (prismaService.foodItem.create as jest.Mock).mockRejectedValue(error);

      await expect(service.create(createData)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return all food items ordered by creation date', async () => {
      const mockItems = [mockFoodItem, TestFactory.createFoodItem()];

      (prismaService.foodItem.findMany as jest.Mock).mockResolvedValue(mockItems);

      const result = await service.findAll();

      expect(prismaService.foodItem.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockItems);
    });

    it('should throw an error when fetching fails', async () => {
      const error = new Error('Database error');
      (prismaService.foodItem.findMany as jest.Mock).mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(error);
    });
  });
}); 