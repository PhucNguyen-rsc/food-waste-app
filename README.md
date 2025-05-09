# feedr: Food Waste Marketplace Platform

A modern platform connecting businesses with consumers to reduce food waste and promote sustainable consumption.

## Features

- **Real-time Inventory Management**: Track and update food items in real-time
- **Dynamic Pricing**: Automatic price adjustments based on expiration dates
- **Order Management**: Streamlined order processing and delivery tracking
- **Multi-platform Support**: Web, mobile, and backend services
- **Secure Payments**: Integrated payment processing with multiple methods
- **Analytics Dashboard**: Track sales, waste reduction, and business metrics

## Architecture

This is a monorepo built with modern technologies:

### Applications
- `apps/web`: Next.js web application
- `apps/mobile`: React Native mobile application
- `apps/backend`: NestJS backend service

### Tech Stack
- **Frontend Web**
  - Next.js 14 with App Router
  - TypeScript
  - ShadCN/UI
  - Tailwind CSS
  - React Query & Zustand

- **Frontend Mobile**
  - React Native (Expo)
  - TypeScript
  - NativeWind
  - Firebase Auth
  - React Query & Zustand

- **Backend**
  - NestJS
  - PostgreSQL
  - Prisma ORM
  - JWT Authentication
  - Jest for testing

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Expo CLI
- Docker (optional)

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/PhucNguyen-rsc/food-waste-app.git
cd food-waste-app
```

2. **Install Dependencies**
```bash
pnpm install
```

3. **Environment Setup**
```bash
# Copy environment files
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
cp apps/backend/.env.example apps/backend/.env

# Edit the .env files with your configuration
```

4. **Database Setup**

First, create a PostgreSQL database and get your connection URL. Then:

```bash
cd packages/database
```

Create a `.env` file in the database directory with your PostgreSQL connection URL:
```bash
echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/food_waste_db\"" > .env
```

Generate Prisma client and run migrations:
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

## Development

### Running the Applications

1. **Start All Services**
```bash
pnpm dev
```

2. **Individual Services**


Mobile App:
```bash
pnpm dev:mobile
# Scan QR code with Expo Go app
```

Backend:
```bash
pnpm dev:backend
# API available at http://localhost:4000
```

### Building for Production

1. **Build All Applications**
```bash
pnpm build
```

2. **Start Production Server**
```bash
pnpm start
```

## Testing

### Unit Tests

Run all tests:
```bash
pnpm test
```

Application-specific tests:
```bash
# Backend tests
cd apps/backend && pnpm test
```

### Coverage Reports

Generate coverage for all applications:
```bash
pnpm test:coverage
```

View coverage reports:
- Backend: `apps/backend/coverage/lcov-report/index.html`

### E2E Testing
```bash
pnpm test:e2e
```

## User Roles

### Business Users
- Manage food inventory
- Set dynamic pricing
- Track orders and analytics
- Manage business profile

### Consumers
- Browse available food items
- Place and track orders
- Manage payment methods
- View order history

### Couriers
- Accept delivery requests
- Update delivery status
- View earnings and history
- Manage availability

### Administrators
- Monitor platform metrics
- Manage user accounts
- Handle disputes
- Configure system settings

## Troubleshooting

### Common Issues

1. **Database Connection**
```bash
# Reset database
pnpm prisma migrate reset
```

2. **Mobile App**
```bash
# Clear cache
pnpm expo start -c

# Reset Metro bundler
rm -rf node_modules/.cache/metro
```

3. **Build Issues**
```bash
# Clean build
pnpm clean

# Fresh install
rm -rf node_modules
pnpm install
```

### Environment Variables

Required environment variables for each application:

#### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/food_waste
JWT_SECRET=your_jwt_secret
PORT=4000
```

#### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:4000
FIREBASE_CONFIG=your_firebase_config
```

## Documentation

- [API Documentation](docs/api.md)
- [Architecture Overview](docs/architecture.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- Phuc Hoang Nguyen
- Mahlet Atrsaw Andargei
- Kwaaku Boamah-Powers
- Sudiksha Kalepu

## Acknowledgments

- Thanks to all contributors
- Inspired by the need to reduce food waste