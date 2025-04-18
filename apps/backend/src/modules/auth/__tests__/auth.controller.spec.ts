import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { UserRole } from '@food-waste/types';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockFirebaseUser = {
    id: 'firebase-uid',
    email: 'test@example.com',
    role: UserRole.BUSINESS,
  };

  const mockAuthResponse = {
    accessToken: 'mock-jwt-token',
    user: {
      id: mockFirebaseUser.id,
      email: mockFirebaseUser.email,
      role: mockFirebaseUser.role,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            handleFirebaseAuth: jest.fn().mockResolvedValue(mockAuthResponse),
          },
        },
      ],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('firebaseAuth', () => {
    it('should call auth service with firebase user and name', async () => {
      const name = 'Test User';
      const result = await controller.firebaseAuth({ user: mockFirebaseUser }, { name });

      expect(authService.handleFirebaseAuth).toHaveBeenCalledWith(mockFirebaseUser, name);
      expect(result).toEqual(mockAuthResponse);
    });

    it('should call auth service without name', async () => {
      const result = await controller.firebaseAuth({ user: mockFirebaseUser }, {});

      expect(authService.handleFirebaseAuth).toHaveBeenCalledWith(mockFirebaseUser, undefined);
      expect(result).toEqual(mockAuthResponse);
    });
  });
}); 