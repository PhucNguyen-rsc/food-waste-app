import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '@prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TestFactory } from '../../../test/factories/test.factory';
import { UserRole } from '@food-waste/types';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByFirebaseUid', () => {
    it('should return a user when found', async () => {
      const mockUser = TestFactory.createUser({ id: 'test-id' });
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByFirebaseUid('test-id');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
    });

    it('should return null when user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findByFirebaseUid('non-existent-id');
      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      (prismaService.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.findByFirebaseUid('test-id')).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create a new user with correct data', async () => {
      const createData = {
        email: 'test@example.com',
        id: 'test-id',
        role: UserRole.CONSUMER,
        name: 'Test User',
      };

      const mockUser = TestFactory.createUser(createData);
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.create(createData);
      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          id: createData.id,
          email: createData.email,
          name: createData.name,
          role: createData.role,
        }),
      });
    });

    it('should create a user without name', async () => {
      const createData = {
        email: 'test@example.com',
        id: 'test-id',
        role: UserRole.CONSUMER,
      };

      const mockUser = TestFactory.createUser({ ...createData, name: null });
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.create(createData);
      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          id: createData.id,
          email: createData.email,
          name: null,
          role: createData.role,
        }),
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      const createData = {
        email: 'test@example.com',
        id: 'test-id',
        role: UserRole.CONSUMER,
        name: 'Test User',
      };

      const existingUser = TestFactory.createUser({ email: createData.email });
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

      await expect(service.create(createData)).rejects.toThrow(ConflictException);
    });

    it('should handle duplicate user creation', async () => {
      const createData = {
        email: 'test@example.com',
        id: 'test-id',
        role: UserRole.CONSUMER,
        name: 'Test User',
      };

      (prismaService.user.create as jest.Mock).mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint failed',
      });

      await expect(service.create(createData)).rejects.toThrow('A user with this email already exists');
    });

    it('should handle database errors during creation', async () => {
      const createData = {
        email: 'test@example.com',
        id: 'test-id',
        role: UserRole.CONSUMER,
        name: 'Test User',
      };

      (prismaService.user.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.create(createData)).rejects.toThrow('Database error');
    });
  });

  describe('updateRole', () => {
    it('should update user role and return new token', async () => {
      const userId = 'test-id';
      const newRole = UserRole.BUSINESS;
      const mockUser = TestFactory.createUser({ id: userId, role: newRole });
      
      (prismaService.user.update as jest.Mock).mockResolvedValue(mockUser);
      (jwtService.sign as jest.Mock).mockReturnValue('mock-jwt-token');

      const result = await service.updateRole(userId, newRole);
      
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: expect.objectContaining({
          id: userId,
          role: newRole,
        }),
      });
      
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { role: newRole },
      });
      
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userId,
        email: mockUser.email,
        role: newRole,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent-id';
      const newRole = UserRole.BUSINESS;

      (prismaService.user.update as jest.Mock).mockRejectedValue({
        code: 'P2025',
        message: 'Record not found',
      });

      await expect(service.updateRole(userId, newRole)).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors during role update', async () => {
      const userId = 'test-id';
      const newRole = UserRole.BUSINESS;

      (prismaService.user.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.updateRole(userId, newRole)).rejects.toThrow('Database error');
    });
  });

  describe('updateUser', () => {
    it('should update user delivery address', async () => {
      const userId = 'test-id';
      const updateData = { deliveryAddress: '123 New St' };
      const mockUser = TestFactory.createUser({ 
        id: userId, 
        role: UserRole.CONSUMER,
        deliveryAddress: updateData.deliveryAddress 
      });

      (prismaService.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.updateUser(userId, updateData);

      expect(result).toEqual(expect.objectContaining({
        id: userId,
        role: UserRole.CONSUMER,
        deliveryAddress: updateData.deliveryAddress,
      }));

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent-id';
      const updateData = { deliveryAddress: '123 New St' };

      (prismaService.user.update as jest.Mock).mockRejectedValue({
        code: 'P2025',
        message: 'Record not found',
      });

      await expect(service.updateUser(userId, updateData)).rejects.toThrow(NotFoundException);
    });

    it('should handle database errors during update', async () => {
      const userId = 'test-id';
      const updateData = { deliveryAddress: '123 New St' };

      (prismaService.user.update as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.updateUser(userId, updateData)).rejects.toThrow('Database error');
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      const mockUser = TestFactory.createUser({ email: 'test@example.com' });
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found by email', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });

    it('should handle database errors when finding by email', async () => {
      (prismaService.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.findByEmail('test@example.com')).rejects.toThrow('Database error');
    });
  });
}); 