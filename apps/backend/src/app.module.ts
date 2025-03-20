import { Module } from '@nestjs/common';
import { AuthModule } from '@app/modules/auth/auth.module';
import { UserModule } from '@app/modules/user/user.module';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
})
export class AppModule {}