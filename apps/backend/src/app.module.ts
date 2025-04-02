import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { PrismaModule } from '@prisma/prisma.module';
import { CommonModule } from '@common/common.module';
import { BusinessModule } from '@business/business.module';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { LoggerMiddleware } from '@middleware/logger.middleware';
import { ItemModule } from '@app/modules/foodItem/foodItem.module'; // ✅ Import your new module here

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CommonModule,
    BusinessModule,
    ItemModule, // ✅ Register the new module here
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
