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
    const token = req.body.token;
    if (!token) {
      throw new UnauthorizedException('No Firebase token provided');
    }

    try {
      const decodedToken = await auth().verifyIdToken(token);
      return {
        id: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || UserRole.UNASSIGNED, // Default to CONSUMER if role not set
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
} 