import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, ip, headers, body } = req;

    // Log request details
    console.log('\n=== Incoming Request ===');
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Method: ${method}`);
    console.log(`URL: ${originalUrl}`);
    console.log(`IP: ${ip}`);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    console.log('Body:', JSON.stringify(body, null, 2));

    // Capture response
    const originalSend = res.send;
    res.send = function (body: any): Response {
      const duration = Date.now() - start;
      console.log('\n=== Response ===');
      console.log(`Duration: ${duration}ms`);
      console.log(`Status: ${res.statusCode}`);
      console.log('Response Body:', JSON.stringify(body, null, 2));
      console.log('==================\n');
      return originalSend.call(this, body);
    };

    next();
  }
} 