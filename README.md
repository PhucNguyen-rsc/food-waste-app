# Food Waste Marketplace Platform

A comprehensive platform for managing surplus food, connecting businesses with consumers, and reducing food waste.

## Project Structure

This is a monorepo containing three main applications:

- `apps/web`: Next.js web application
- `apps/mobile`: React Native mobile application
- `apps/backend`: NestJS backend service

## Tech Stack

- **Frontend Web**: Next.js 14 with App Router, TypeScript, ShadCN/UI, Tailwind CSS
- **Frontend Mobile**: React Native (Expo), TypeScript, NativeWind
- **Backend**: NestJS, PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js (Web), Firebase Auth (Mobile)
- **State Management**: React Query & Zustand
- **Database**: PostgreSQL
- **Deployment**: Vercel (Web), Railway (Backend), Expo (Mobile)
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL
- Expo CLI (for mobile development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/food-waste-app.git
cd food-waste-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start development servers:

Web app:
```bash
pnpm dev:web
```

Mobile app:
```bash
pnpm dev:mobile
```

Backend:
```bash
pnpm dev:backend
```

## Project Structure

```
food-waste-app/
├── apps/
│   ├── web/           # Next.js web application
│   ├── mobile/        # React Native mobile application
│   └── backend/       # NestJS backend service
├── packages/          # Shared packages
│   ├── ui/           # Shared UI components
│   ├── config/       # Shared configuration
│   └── types/        # Shared TypeScript types
└── package.json
```

## User Roles

1. **Businesses**
   - List and manage surplus food
   - Manage orders
   - Update inventory
   - View analytics

2. **Consumers**
   - Browse and buy food
   - Track orders
   - Earn rewards

3. **Couriers**
   - Accept deliveries
   - Update status
   - Navigate routes

4. **Admins**
   - Monitor platform analytics
   - Manage users
   - Ensure compliance

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
