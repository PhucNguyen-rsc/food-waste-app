import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@decorators/public.decorator';
import { ROLES_KEY } from '@decorators/roles.decorator';
import { UserRole } from '@food-waste/types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    console.log('\n=== JWT Auth Guard: Request Processing ===');
    const request = context.switchToHttp().getRequest();
    console.log(`[JWT Guard] Request URL: ${request.method} ${request.url}`);
    console.log(`[JWT Guard] Headers:`, request.headers);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log(`[JWT Guard] Route is public, skipping authentication`);
      return true;
    }

    console.log(`[JWT Guard] Route requires authentication`);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('\n=== JWT Auth Guard: Token Validation ===');
    
    if (err) {
      console.error(`[JWT Guard] Error during authentication:`, err);
      throw err;
    }

    if (!user) {
      console.error(`[JWT Guard] No user found in token`);
      throw new UnauthorizedException('Invalid or expired token');
    }

    console.log(`[JWT Guard] User authenticated:`, {
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles) {
      console.log(`[JWT Guard] Required roles:`, requiredRoles);
      console.log(`[JWT Guard] User role:`, user.role);

      if (!requiredRoles.includes(user.role)) {
        console.error(`[JWT Guard] User role ${user.role} not in required roles ${requiredRoles}`);
        throw new UnauthorizedException('Insufficient permissions');
      }

      console.log(`[JWT Guard] Role check passed`);
    } else {
      console.log(`[JWT Guard] No role requirements specified`);
    }

    console.log('=== JWT Auth Guard: Request Approved ===\n');
    return user;
  }
} 