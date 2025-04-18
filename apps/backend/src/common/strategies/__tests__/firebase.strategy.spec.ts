import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseStrategy } from '../firebase.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@food-waste/types';
import { mockVerifyIdToken } from './__mocks__/firebase-admin';

jest.mock('firebase-admin');

describe('FirebaseStrategy', () => {
  let strategy: FirebaseStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseStrategy],
    }).compile();

    strategy = module.get<FirebaseStrategy>(FirebaseStrategy);
    mockVerifyIdToken.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should throw UnauthorizedException when no token is provided', async () => {
      const req = { body: {} };

      await expect(strategy.validate(req)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(req)).rejects.toThrow('No Firebase token provided');
    });

    it('should return user data when token is valid', async () => {
      const mockToken = 'valid-token';
      const mockDecodedToken = {
        uid: 'test-uid',
        email: 'test@example.com',
        role: UserRole.BUSINESS,
      };

      const req = { body: { token: mockToken } };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const result = await strategy.validate(req);

      expect(mockVerifyIdToken).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual({
        id: mockDecodedToken.uid,
        email: mockDecodedToken.email,
        role: mockDecodedToken.role,
      });
    });

    it('should use UNASSIGNED role when role is not set in token', async () => {
      const mockToken = 'valid-token';
      const mockDecodedToken = {
        uid: 'test-uid',
        email: 'test@example.com',
      };

      const req = { body: { token: mockToken } };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const result = await strategy.validate(req);

      expect(result).toEqual({
        id: mockDecodedToken.uid,
        email: mockDecodedToken.email,
        role: UserRole.UNASSIGNED,
      });
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const mockToken = 'invalid-token';
      const req = { body: { token: mockToken } };

      mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(strategy.validate(req)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(req)).rejects.toThrow('Invalid Firebase token');
    });
  });
});
