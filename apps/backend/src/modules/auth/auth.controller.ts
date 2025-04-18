import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('firebase')
  @UseGuards(FirebaseAuthGuard)
  async firebaseAuth(@Request() req, @Body() body: { name?: string }) {
    return this.authService.handleFirebaseAuth(req.user, body.name);
  }
} 