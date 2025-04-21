import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getApiConfig } from '@food-waste/config';
import * as admin from 'firebase-admin';

async function bootstrap() {
  // Initialize Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

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
      const allowedOrigins = [
        ...API_CONFIG.CORS.ORIGINS,
        'http://192.168.10.245:3002', // Mobile app
        'http://localhost:3002',
        'http://127.0.0.1:3002',
        '*'
      ];

      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
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
