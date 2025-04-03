import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    this.logger.log(`Creating item with data: ${JSON.stringify(data)}`);
    try {
      const result = await this.prisma.foodItem.create({ data });
      this.logger.log(`Item created successfully with ID: ${result.id}`);
      return result;
    } catch (err) {
      this.logger.error('Failed to create item', err.stack || err.message);
      throw err;
    }
  }

  async findAll() {
    this.logger.log('Fetching all items...');
    try {
      const items = await this.prisma.foodItem.findMany({
        orderBy: { createdAt: 'desc' },
      });
      this.logger.log(`Fetched ${items.length} items`);
      return items;
    } catch (err) {
      this.logger.error('Failed to fetch items', err.stack || err.message);
      throw err;
    }
  }
}
