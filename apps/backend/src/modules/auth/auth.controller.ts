import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { UsersService } from '../users/users.service';
import { UserRole } from '@food-waste/types';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @Post('firebase')
  @UseGuards(FirebaseAuthGuard)
  async firebaseAuth(@Request() req, @Body() body: { name?: string }) {
    const firebaseUser = req.user;
    
    // Find or create user in database
    let user = await this.usersService.findByFirebaseUid(firebaseUser.id);
    
    if (!user) {
      user = await this.usersService.create({
        id: firebaseUser.id,
        email: firebaseUser.email,
        name: body.name,
        role: firebaseUser.role || UserRole.UNASSIGNED,
      });
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        // Include role-specific fields
        ...(user.role === UserRole.BUSINESS && {
          businessName: user.businessName,
          businessAddress: user.businessAddress,
          businessPhone: user.businessPhone,
        }),
        ...(user.role === UserRole.CONSUMER && {
          deliveryAddress: user.deliveryAddress,
        }),
        ...(user.role === UserRole.COURIER && {
          isAvailable: user.isAvailable,
          currentLocation: user.currentLocation,
          vehicleType: user.vehicleType,
        }),
      },
    };
  }
} 