import { Controller, Post, Body, UseGuards, Request, ConflictException } from '@nestjs/common';
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
    
    try {
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
    } catch (error) {
      if (error instanceof ConflictException) {
        // If there's a conflict with the email, try to find the user by email
        const existingUser = await this.usersService.findByEmail(firebaseUser.email);
        if (existingUser) {
          // If we found the user by email, return their data
          const payload = {
            sub: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
          };

          const accessToken = this.jwtService.sign(payload);

          return {
            accessToken,
            user: {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              role: existingUser.role,
              ...(existingUser.role === UserRole.BUSINESS && {
                businessName: existingUser.businessName,
                businessAddress: existingUser.businessAddress,
                businessPhone: existingUser.businessPhone,
              }),
              ...(existingUser.role === UserRole.CONSUMER && {
                deliveryAddress: existingUser.deliveryAddress,
              }),
              ...(existingUser.role === UserRole.COURIER && {
                isAvailable: existingUser.isAvailable,
                currentLocation: existingUser.currentLocation,
                vehicleType: existingUser.vehicleType,
              }),
            },
          };
        }
      }
      throw error;
    }
  }
} 