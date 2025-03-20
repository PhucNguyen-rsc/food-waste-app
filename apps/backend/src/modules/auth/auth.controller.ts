import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from '@app/modules/auth/auth.service';
import { LoginDto } from '@app/modules/auth/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('test')
  test() {
    return { message: 'Auth module is working!' };
  }
}