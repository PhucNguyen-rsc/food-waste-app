import { Module } from '@nestjs/common';
import { BusinessController } from '@business/business.controller';
import { BusinessService } from '@business/business.service';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {} 