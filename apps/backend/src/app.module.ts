import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@prisma/prisma.module';
import { BusinessModule } from '@app/modules/business/business.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { UsersModule } from '@app/modules/users/users.module';
import { LoggerMiddleware } from '@middleware/logger.middleware';
import { ItemModule } from '@app/modules/foodItem/foodItem.module';
import { CourierModule } from '@app/modules/courier/courier.module';
import { ConsumerModule } from '@app/modules/consumer/consumer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    BusinessModule,
    AuthModule,
    UsersModule,
    ItemModule,
    CourierModule,
    ConsumerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
