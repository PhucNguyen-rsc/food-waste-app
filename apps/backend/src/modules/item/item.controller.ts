import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
  private readonly logger = new Logger(ItemController.name);

  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() data: any) {
    this.logger.log(`Received POST /items with data: ${JSON.stringify(data)}`);
    return this.itemService.create(data);
  }

  @Get()
  findAll() {
    this.logger.log('Received GET /items');
    return this.itemService.findAll();
  }
}
