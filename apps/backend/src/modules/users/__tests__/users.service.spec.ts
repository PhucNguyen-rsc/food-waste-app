import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '@prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TestFactory } from '../../../test/factories/test.factory';
import { UserRole } from '@food-waste/types';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
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
  });
}); 