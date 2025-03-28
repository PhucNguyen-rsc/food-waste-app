import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@common/strategies/jwt.strategy';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class CommonModule {} 