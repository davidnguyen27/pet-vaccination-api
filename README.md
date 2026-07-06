# Pet Vaccination API

Backend API for the Pet Vaccination Management System. The project supports clinic workflows such as authentication, pet owners, pets, appointments, vaccination records, microchip services, invoices, payments, staff, and veterinarian operations.

## Tech Stack

- Node.js + Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- class-validator and class-transformer for request validation
- JWT authentication
- pnpm

## Project Structure

```txt
src/
  app.ts                  Express app setup
  server.ts               Server entrypoint
  core/                   Shared infrastructure
    db/                   Prisma client setup
    env/                  Environment validation
    errors/               App-level errors
    middlewares/          Validation and error middleware
  modules/
    auth/                 Auth routes, controller, service, repository, schema, types

prisma/
  schema.prisma           Database schema
  seed.ts                 Initial seed data

generated/
  prisma/                 Generated Prisma client
```

The project follows this backend flow:

```txt
route -> validation middleware -> controller -> service -> repository -> prisma
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a `.env` file and configure at least:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pvms?schema=public"
PORT=3000
NODE_ENV=development
JWT_ACCESS_SECRET="your_jwt_secret_key"
JWT_ACCESS_EXPIRES_IN="60m"
```

Generate Prisma client:

```bash
pnpm db:generate
```

Run database migration:

```bash
pnpm db:migrate
```

Seed the initial admin account:

```bash
pnpm db:seed
```

Default admin credentials:

```txt
email: admin@petclinic.vn
password: Admin@123
```

These can be changed through `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_FULL_NAME` in `.env`.

## Running The App

Development:

```bash
pnpm dev
```

Production build:

```bash
pnpm build
pnpm start
```

Health check:

```txt
GET /health
```

## Available Scripts

```bash
pnpm dev          Start development server
pnpm build        Build TypeScript output
pnpm start        Run compiled server
pnpm lint         Run ESLint
pnpm lint:fix     Fix lint issues where possible
pnpm prettier     Check formatting
pnpm prettier:fix Format files
pnpm db:generate  Generate Prisma client
pnpm db:migrate   Run Prisma migration
pnpm db:seed      Seed initial data
pnpm db:studio    Open Prisma Studio
```

## Current Auth APIs

```txt
POST /auth/login
POST /auth/logout
```

`POST /auth/login` returns an access token and the authenticated user profile.

## Development Notes

- Keep business logic in services.
- Keep Prisma access inside repositories.
- Validate external input with class-validator DTO classes.
- Use centralized error handling through `AppError`.
- Do not edit `generated/prisma` manually; run `pnpm db:generate` after schema changes.
