import { Module } from '@nestjs/common';
import { UserService } from '@app/modules/user/user.service';
import { UserController } from '@app/modules/user/user.controller';
import { PrismaService } from '@app/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {} 