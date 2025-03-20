import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '@app/modules/auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async login(loginDto: LoginDto) {
    // Simple validation logic
    if (loginDto.username !== 'testuser' || loginDto.password !== 'testpass') {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: loginDto.username, sub: loginDto.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}