import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../jwt.strategy';

jest.mock('@nestjs/config');

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should throw error when JWT_SECRET is not defined', () => {
    const originalEnv = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    expect(() => {
      new JwtStrategy();
    }).toThrow('JWT_SECRET must be defined in environment variables');

    process.env.JWT_SECRET = originalEnv;
  });

  describe('validate', () => {
    it('should return user data from payload', async () => {
      const mockPayload = {
        sub: 'test-user-id',
        email: 'test@example.com',
        role: 'BUSINESS',
      };

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual({
        id: mockPayload.sub,
        email: mockPayload.email,
        role: mockPayload.role,
      });
    });

    it('should handle missing optional fields', async () => {
      const mockPayload = {
        sub: 'test-user-id',
      };

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual({
        id: mockPayload.sub,
        email: undefined,
        role: undefined,
      });
    });
  });
}); 