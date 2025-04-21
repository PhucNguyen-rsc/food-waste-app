import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { auth } from 'firebase-admin';
import { UserRole } from '@food-waste/types';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor() {
    super();
  }

  async validate(req: any): Promise<any> {
    // Try to get token from query params first, then body
    const token = req.query.token || req.body?.token;
    
    if (!token) {
      console.error('[Firebase Strategy] No token found in request:', {
        query: req.query,
        body: req.body,
        method: req.method
      });
      throw new UnauthorizedException('No Firebase token provided');
    }

    try {
      console.log('[Firebase Strategy] Verifying token...');
      const decodedToken = await auth().verifyIdToken(token);
      console.log('[Firebase Strategy] Token verification details:', {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || 'UNASSIGNED'
      });
      
      return {
        id: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || UserRole.UNASSIGNED,
      };
    } catch (error) {
      console.error('[Firebase Strategy] Token verification failed:', error);
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
} 