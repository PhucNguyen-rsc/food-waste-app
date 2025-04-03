import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@decorators/public.decorator';
import { ROLES_KEY } from '@decorators/roles.decorator';
import { UserRole } from '@food-waste/types';

@Injectable()
export class FirebaseAuthGuard extends AuthGuard('firebase') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('\n=== Firebase Auth Guard: Request Processing ===');
    const request = context.switchToHttp().getRequest();
    console.log(`[Firebase Guard] Request URL: ${request.method} ${request.url}`);
    console.log(`[Firebase Guard] Headers:`, request.headers);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log(`[Firebase Guard] Route is public, skipping authentication`);
      return Promise.resolve(true);
    }

    console.log(`[Firebase Guard] Route requires authentication`);
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('\n=== Firebase Auth Guard: Token Validation ===');
    
    if (err) {
      console.error(`[Firebase Guard] Error during authentication:`, err);
      throw new UnauthorizedException('Invalid Firebase token');
    }

    if (!user) {
      console.error(`[Firebase Guard] No user found in Firebase token`);
      throw new UnauthorizedException('Invalid Firebase token');
    }

    console.log(`[Firebase Guard] User authenticated:`, {
      id: user.id,
      email: user.email,
      role: user.role,
      firebaseUid: user.firebaseUid
    });

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles) {
      console.log(`[Firebase Guard] Required roles:`, requiredRoles);
      console.log(`[Firebase Guard] User role:`, user.role);

      if (!requiredRoles.includes(user.role)) {
        console.error(`[Firebase Guard] User role ${user.role} not in required roles ${requiredRoles}`);
        throw new UnauthorizedException('Insufficient permissions');
      }

      console.log(`[Firebase Guard] Role check passed`);
    } else {
      console.log(`[Firebase Guard] No role requirements specified`);
    }

    console.log('=== Firebase Auth Guard: Request Approved ===\n');
    return user;
  }
} 