import { Module } from '@nestjs/common';
import { ItemService } from '@app/modules/foodItem/foodItem.service';
import { ItemController } from '@app/modules/foodItem/foodItem.controller';

@Module({
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
