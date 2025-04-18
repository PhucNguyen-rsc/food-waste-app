import { Test, TestingModule } from '@nestjs/testing';
import { LoggerMiddleware } from '../logger.middleware';
import { Request, Response, NextFunction } from 'express';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response> & { send: jest.Mock };
  let mockNext: jest.Mock;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    mockNext = jest.fn();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Setup mock request
    mockRequest = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'test-agent',
        'content-type': 'application/json',
      },
      body: { test: 'data' },
    };

    // Setup mock response
    mockResponse = {
      statusCode: 200,
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('request logging', () => {
    it('should log request details', () => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(consoleSpy).toHaveBeenCalledWith('\n=== Incoming Request ===');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Timestamp:'));
      expect(consoleSpy).toHaveBeenCalledWith('Method: GET');
      expect(consoleSpy).toHaveBeenCalledWith('URL: /test');
      expect(consoleSpy).toHaveBeenCalledWith('IP: 127.0.0.1');
      expect(consoleSpy).toHaveBeenCalledWith('Headers:', expect.any(String));
      expect(consoleSpy).toHaveBeenCalledWith('Body:', expect.any(String));
    });

    it('should call next function', () => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('response logging', () => {
    it('should log response details', () => {
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      const responseBody = { success: true };
      
      mockResponse.send(responseBody);

      expect(consoleSpy).toHaveBeenCalledWith('\n=== Response ===');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Duration:'));
      expect(consoleSpy).toHaveBeenCalledWith('Status: 200');
      expect(consoleSpy).toHaveBeenCalledWith('Response Body:', expect.any(String));
      expect(consoleSpy).toHaveBeenCalledWith('==================\n');
    });

    it('should preserve original send functionality', () => {
      const originalSend = mockResponse.send;

      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      const responseBody = { success: true };
      const result = mockResponse.send(responseBody);

      expect(result).toBe(mockResponse);
    });
  });
}); 