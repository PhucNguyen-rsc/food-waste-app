import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma/prisma.service';
import { AppModule } from '@app/app.module';

export class TestUtils {
  static async getTestingModule() {
    return await Test.createTestingModule({
      imports: [AppModule],
    });
  }

  static async createTestApp(): Promise<INestApplication> {
    const moduleRef = await (await this.getTestingModule()).compile();
    const app = moduleRef.createNestApplication();
    await app.init();
    return app;
  }

  static async closeTestApp(app: INestApplication) {
    const prismaService = app.get(PrismaService);
    await prismaService.$disconnect();
    await app.close();
  }
}

// Global test setup
beforeAll(async () => {
  // Add any global setup here
});

// Global test teardown
afterAll(async () => {
  // Add any global cleanup here
}); 