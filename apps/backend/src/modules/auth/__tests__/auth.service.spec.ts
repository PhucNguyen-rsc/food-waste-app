import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { UserRole } from '@food-waste/types';
import { TestFactory } from '../../../test/factories/test.factory';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockFirebaseUser = {
    id: 'firebase-uid',
    email: 'test@example.com',
    role: UserRole.BUSINESS,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByFirebaseUid: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleFirebaseAuth', () => {
    it('should return existing user with token', async () => {
      const existingUser = TestFactory.createUser({
        id: mockFirebaseUser.id,
        email: mockFirebaseUser.email,
        role: mockFirebaseUser.role,
      });

      (usersService.findByFirebaseUid as jest.Mock).mockResolvedValue(existingUser);

      const result = await service.handleFirebaseAuth(mockFirebaseUser);

      expect(usersService.findByFirebaseUid).toHaveBeenCalledWith(mockFirebaseUser.id);
      expect(usersService.create).not.toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      });
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: expect.objectContaining({
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
        }),
      });
    });

    it('should create new user if not found', async () => {
      const newUser = TestFactory.createUser({
        id: mockFirebaseUser.id,
        email: mockFirebaseUser.email,
        role: mockFirebaseUser.role,
      });

      (usersService.findByFirebaseUid as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(newUser);

      const result = await service.handleFirebaseAuth(mockFirebaseUser, 'Test User');

      expect(usersService.findByFirebaseUid).toHaveBeenCalledWith(mockFirebaseUser.id);
      expect(usersService.create).toHaveBeenCalledWith({
        id: mockFirebaseUser.id,
        email: mockFirebaseUser.email,
        name: 'Test User',
        role: mockFirebaseUser.role,
      });
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: expect.objectContaining({
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
        }),
      });
    });

    it('should handle unassigned role', async () => {
      const firebaseUser = { ...mockFirebaseUser, role: undefined };
      const newUser = TestFactory.createUser({
        id: firebaseUser.id,
        email: firebaseUser.email,
        role: UserRole.UNASSIGNED,
      });

      (usersService.findByFirebaseUid as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(newUser);

      const result = await service.handleFirebaseAuth(firebaseUser);

      expect(usersService.create).toHaveBeenCalledWith(expect.objectContaining({
        role: UserRole.UNASSIGNED,
      }));
      expect(result.user.role).toBe(UserRole.UNASSIGNED);
    });
  });

  describe('formatUserResponse', () => {
    it('should format business user response', () => {
      const businessUser = TestFactory.createUser({
        role: UserRole.BUSINESS,
        businessName: 'Test Business',
        businessAddress: '123 Test St',
        businessPhone: '123-456-7890',
      });

      const result = service['formatUserResponse'](businessUser);

      expect(result).toEqual(expect.objectContaining({
        businessName: businessUser.businessName,
        businessAddress: businessUser.businessAddress,
        businessPhone: businessUser.businessPhone,
      }));
    });

    it('should format consumer user response', () => {
      const consumerUser = TestFactory.createUser({
        role: UserRole.CONSUMER,
        deliveryAddress: '456 Consumer Ave',
      });

      const result = service['formatUserResponse'](consumerUser);

      expect(result).toEqual(expect.objectContaining({
        deliveryAddress: consumerUser.deliveryAddress,
      }));
    });

    it('should format courier user response', () => {
      const courierUser = TestFactory.createUser({
        role: UserRole.COURIER,
        isAvailable: true,
        currentLocation: '789 Courier Blvd',
        vehicleType: 'BICYCLE',
      });

      const result = service['formatUserResponse'](courierUser);

      expect(result).toEqual(expect.objectContaining({
        isAvailable: courierUser.isAvailable,
        currentLocation: courierUser.currentLocation,
        vehicleType: courierUser.vehicleType,
      }));
    });
  });
}); 