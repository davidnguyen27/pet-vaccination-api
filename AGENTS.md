# AGENTS.md

## Project Overview

This is a Node.js + Express.js + TypeScript backend API for a pet vaccination management system.

The project manages core clinic operations such as:

- Authentication
- User management
- Pet owners
- Pets
- Vaccination records
- Vaccine services
- Appointments
- Microchip services
- Staff and veterinarian workflows

Tech stack:

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- pnpm
- Zod for validation
- JWT authentication
- Cookie-based refresh token flow

The goal is to build a clean, maintainable, scalable, and predictable backend API.

---

## Commands

Use these commands when working in this project:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm prisma generate
pnpm prisma migrate dev
```

Do not add a testing step unless the user explicitly asks for tests.

---

## Main Architecture

Use layered architecture:

```txt
Route -> Controller -> Service -> Repository -> Prisma -> Database
```

Rules:

1. Route only defines endpoint and middleware.
2. Controller handles request and response.
3. Service contains business logic.
4. Repository contains Prisma database access.
5. Prisma should not be used directly in controllers or routes.

---

## Source Structure

Prefer this structure:

```txt
src/
├─ server.ts
├─ app.ts
├─ core/
│  ├─ env/
│  │  └─ env.ts
│  ├─ db/
│  │  └─ prisma.ts
│  ├─ errors/
│  ├─ middlewares/
│  ├─ routes/
│  └─ logs/
├─ modules/
│  ├─ auth/
│  │  ├─ auth.route.ts
│  │  ├─ auth.controller.ts
│  │  ├─ auth.service.ts
│  │  ├─ auth.repository.ts
│  │  ├─ auth.schema.ts
│  │  └─ auth.type.ts
│  ├─ users/
│  ├─ pets/
│  ├─ appointments/
│  ├─ vaccinations/
│  └─ microchips/
└─ shared/
   ├─ constants/
   ├─ enums/
   ├─ helpers/
   ├─ types/
   └─ utils/
```

---

## Coding Rules

- Use TypeScript strictly.
- Avoid `any`. Use explicit types.
- Use Zod for request body, params, and query validation.
- Use async/await.
- Do not swallow errors.
- Do not use `console.log` for production code.
- Do not access `process.env` directly outside env/config files.
- Do not put business logic in route files.
- Do not put Prisma queries in controller files.
- Do not create unnecessary abstractions.
- Do not add libraries unless there is a clear reason.

---

## Response Style For AI Agent

Before editing code:

1. Understand the existing folder structure.
2. Reuse current conventions.
3. Avoid rewriting unrelated files.
4. Explain important architectural decisions.

After finishing a coding task:

1. Summarize what changed.
2. List changed files.
3. Explain important decisions.
4. Mention anything the user should manually review.
