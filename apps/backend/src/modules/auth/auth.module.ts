import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '@common/strategies/jwt.strategy';
import { FirebaseStrategy } from '@common/strategies/firebase.strategy';
import { BusinessModule } from '@business/business.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    BusinessModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, FirebaseStrategy],
  exports: [JwtModule],
})
export class AuthModule {
  constructor(private configService: ConfigService) {
    console.log('\n=== JWT Configuration ===');
    console.log('JWT_SECRET:', this.configService.get('JWT_SECRET') ? '✅ Defined' : '❌ Undefined');
    console.log('========================\n');
  }
} 