import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getApiConfig } from '@food-waste/config';

async function bootstrap() {
  const API_CONFIG = getApiConfig();
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ✅ Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Allow known frontend origins (local IPs and localhost)
      if (
        API_CONFIG.CORS.ORIGINS.includes(origin) ||
        API_CONFIG.CORS.ORIGINS.includes('*')
      ) {
        callback(null, true);
      } else {
        callback(new Error(`❌ Not allowed by CORS: ${origin}`));
      }
    },
    methods: API_CONFIG.CORS.METHODS,
    credentials: API_CONFIG.CORS.CREDENTIALS,
    allowedHeaders: API_CONFIG.CORS.ALLOWED_HEADERS,
  });

  await app.listen(API_CONFIG.PORT);
  console.log(`🚀 Server is running on port ${API_CONFIG.PORT}`);
  console.log('🌐 CORS Origins Allowed:', API_CONFIG.CORS.ORIGINS.join(', '));
}

bootstrap();
