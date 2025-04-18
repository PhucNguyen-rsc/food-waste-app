import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { UserRole } from '@food-waste/types';
import { TestFactory } from '../../../test/factories/test.factory';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    role: UserRole.BUSINESS,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByFirebaseUid: jest.fn(),
            updateRole: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = 'test-user-id';
      const mockUser = TestFactory.createUser({ id: userId });

      (usersService.findByFirebaseUid as jest.Mock).mockResolvedValue(mockUser);

      const result = await controller.findOne(userId);

      expect(usersService.findByFirebaseUid).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      const userId = 'non-existent-id';

      (usersService.findByFirebaseUid as jest.Mock).mockResolvedValue(null);

      const result = await controller.findOne(userId);

      expect(usersService.findByFirebaseUid).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('updateRole', () => {
    it('should update user role', async () => {
      const newRole = UserRole.CONSUMER;
      const updatedUser = TestFactory.createUser({ ...mockUser, role: newRole });

      (usersService.updateRole as jest.Mock).mockResolvedValue(updatedUser);

      const result = await controller.updateRole({ user: mockUser }, newRole);

      expect(usersService.updateRole).toHaveBeenCalledWith(mockUser.id, newRole);
      expect(result).toEqual(updatedUser);
    });

    it('should handle invalid role', async () => {
      const invalidRole = 'INVALID_ROLE' as UserRole;
      const updatedUser = TestFactory.createUser({ ...mockUser, role: invalidRole });

      (usersService.updateRole as jest.Mock).mockResolvedValue(updatedUser);

      const result = await controller.updateRole({ user: mockUser }, invalidRole);

      expect(usersService.updateRole).toHaveBeenCalledWith(mockUser.id, invalidRole);
      expect(result).toEqual(updatedUser);
    });
  });
}); 