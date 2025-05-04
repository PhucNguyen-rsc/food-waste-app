import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { FirebaseAuthGuard } from '../firebase-auth.guard';
import { UserRole } from '@food-waste/types';

describe('FirebaseAuthGuard', () => {
  let guard: FirebaseAuthGuard;
  let reflector: Reflector;
  let mockContext: ExecutionContext;
  let parentCanActivateSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FirebaseAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<FirebaseAuthGuard>(FirebaseAuthGuard);
    reflector = module.get<Reflector>(Reflector);

    // Setup mock context
    mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          headers: {
            authorization: 'Bearer token',
          },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    // Setup parent canActivate spy
    parentCanActivateSpy = jest.spyOn(Object.getPrototypeOf(guard), 'canActivate');
  });

  afterEach(() => {
    // Clean up all mocks
    jest.clearAllMocks();
    // Restore the parent canActivate spy
    parentCanActivateSpy.mockRestore();
  });

  afterAll(() => {
    // Ensure all timers are cleared
    jest.clearAllTimers();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access to public routes', async () => {
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should require authentication for non-public routes', async () => {
      (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
      parentCanActivateSpy.mockImplementation(() => Promise.resolve(true));

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
      expect(parentCanActivateSpy).toHaveBeenCalledWith(mockContext);
    });
  });

  describe('handleRequest', () => {
    it('should throw UnauthorizedException when there is an error', () => {
      const error = new Error('Test error');
      expect(() => {
        guard.handleRequest(error, null, null, mockContext);
      }).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when no user is found', () => {
      expect(() => {
        guard.handleRequest(null, null, null, mockContext);
      }).toThrow(UnauthorizedException);
    });

    it('should return user when authentication is successful', () => {
      const user = {
        id: 'test-id',
        email: 'test@example.com',
        role: UserRole.BUSINESS,
      };

      const result = guard.handleRequest(null, user, null, mockContext);
      expect(result).toBe(user);
    });

    it('should check user roles when required', () => {
      const user = {
        id: 'test-id',
        email: 'test@example.com',
        role: UserRole.BUSINESS,
      };

      (reflector.getAllAndOverride as jest.Mock).mockReturnValue([UserRole.BUSINESS]);
      const result = guard.handleRequest(null, user, null, mockContext);
      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException when user role is not in required roles', () => {
      const user = {
        id: 'test-id',
        email: 'test@example.com',
        role: UserRole.CONSUMER,
      };

      (reflector.getAllAndOverride as jest.Mock).mockReturnValue([UserRole.BUSINESS]);
      expect(() => {
        guard.handleRequest(null, user, null, mockContext);
      }).toThrow(UnauthorizedException);
    });
  });
}); 