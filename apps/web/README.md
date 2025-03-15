# Food Waste Marketplace - Web Application

This is the web application for the Food Waste Marketplace platform. It's built with Next.js, TypeScript, and Tailwind CSS.

## Features

- User authentication with NextAuth.js
- Role-based access control (Business, Consumer, Courier, Admin)
- Modern UI with Tailwind CSS and shadcn/ui components
- Dark mode support
- Responsive design
- Form validation with React Hook Form and Zod
- Toast notifications
- Type-safe database access with Prisma

## Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later
- PostgreSQL 14.x or later

## Getting Started

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
   Edit the `.env` file with your configuration.

4. Set up the database:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # UI components
│   └── providers/   # Context providers
├── lib/             # Utility functions and configurations
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
