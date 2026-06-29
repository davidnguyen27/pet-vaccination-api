---
name: backend-dev-guidelines
description: Backend development skill for Express.js + Node.js + TypeScript + Prisma APIs. Use this when creating or modifying routes, controllers, services, repositories, Prisma queries, validation schemas, auth flow, middleware, or backend architecture.
---

# Backend Development Guidelines

## Purpose

Use this skill to build clean, maintainable, and predictable backend APIs with:

- Express.js
- TypeScript
- Prisma
- PostgreSQL
- Zod
- JWT authentication
- Layered architecture

This skill is strict about architecture but practical for real project development.

---

## When To Use This Skill

Use this skill when working on:

- API routes
- Controllers
- Services
- Repositories
- Prisma database access
- Zod validation
- Authentication
- Authorization
- Middleware
- Error handling
- Pagination
- Backend refactoring

---

## Architecture Rule

Always follow this architecture:

```txt
Route -> Controller -> Service -> Repository -> Prisma -> Database
```

Each layer has one responsibility.

---

## Layer Responsibilities

### Route

Route files should only define:

- URL path
- HTTP method
- Middleware chain
- Controller handler

Route files must not contain business logic.

---

### Controller

Controller files should:

- Receive request
- Get validated data
- Call service
- Return response
- Pass error to `next(error)`

Controller files must not:

- Use Prisma directly
- Hash passwords
- Generate tokens unless it is a very small auth controller and project convention allows it
- Contain complex business rules

---

### Service

Service files should:

- Contain business logic
- Call repositories
- Check business rules
- Coordinate multiple repositories
- Use transaction methods when needed
- Be independent from Express request/response

Service files must not:

- Return Express responses
- Depend on `Request`, `Response`, or `NextFunction`
- Directly parse HTTP query strings
- Directly access `process.env`

---

### Repository

Repository files should:

- Use Prisma
- Encapsulate database queries
- Expose intent-based methods
- Handle complex query logic
- Handle transactions when needed

Repository files must not:

- Format HTTP responses
- Handle request validation
- Contain auth decisions
- Read cookies or headers

---

## Validation Rule

Validate all external input with Zod.

Validate:

- body
- params
- query
- cookies when needed
- uploaded file metadata when needed

Example:

```ts
export const createPetSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    species: z.string().min(1),
    ownerId: z.string().uuid()
  })
})
```

Use the inferred type:

```ts
export type CreatePetInput = z.infer<typeof createPetSchema>['body']
```

---

## Error Handling Rule

Use centralized error handling.

Recommended pattern:

```ts
throw new AppError('Pet not found', 404)
```

Then global error middleware should format the response.

Do not hide errors.

Bad:

```ts
try {
  await service.doSomething()
} catch (error) {
  console.log(error)
}
```

Good:

```ts
try {
  await service.doSomething()
} catch (error) {
  next(error)
}
```

---

## Config Rule

Environment variables should be read in one place only.

Recommended files:

```txt
src/core/env.ts
src/core/config/index.ts
```

Do not use this across the codebase:

```ts
process.env.JWT_SECRET
```

Prefer this:

```ts
env.JWT_SECRET
```

---

## Prisma Rule

Only repository files should use Prisma directly.

Bad:

```ts
// user.controller.ts
await prisma.user.findMany()
```

Good:

```ts
// user.repository.ts
findMany(params) {
  return prisma.user.findMany(params)
}
```

---

## Dependency Rule

Prefer dependency injection by constructor.

Example:

```ts
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
```

This makes the service easier to test and easier to refactor.

---

## API Response Rule

Use consistent response format.

Success:

```ts
{
  success: true,
  message: 'Success',
  data
}
```

Paginated:

```ts
{
  success: true,
  message: 'Success',
  data,
  meta: {
    page,
    limit,
    total,
    totalPages
  }
}
```

Error:

```ts
{
  success: false,
  message: 'Error message',
  errors
}
```

---

## Auth Rule

For authentication:

- Refresh token should be stored in HTTP-only cookie.
- Access token can be returned to client depending on project design.
- Do not store refresh token in localStorage.
- Do not expose password hash.
- Do not trust role or userId from request body if they should come from token.

---

## Microchip Business Rule

For microchip services:

- The system should allow scanning valid external microchips.
- The system should allow implanting shop-provided microchips when customer requests it.
- A scanned chip should be accepted if it is valid, regardless of whether it came from the shop or outside.
- The system should still track source/origin when useful.

Recommended fields:

```txt
chipCode
sourceType: internal | external
isValid
petId
implantedAt
scannedAt
```

---

## Pet Vaccination Business Rule

For vaccination features:

- Keep vaccine records immutable where possible.
- Do not delete completed vaccination history unless explicitly required.
- Prefer status updates over destructive changes.
- Appointment and vaccination record should be separated.
- A completed vaccination should record veterinarian, pet, vaccine, date, and next due date if applicable.

---

## Anti-Patterns

Reject these patterns:

- Business logic in routes
- Prisma queries in controllers
- Missing validation
- Direct `process.env` usage everywhere
- Returning password hash
- Silent catch blocks
- Unclear function names
- Over-engineered abstractions
- Large unrelated refactors
- Adding packages without reason

---

## Before Coding Checklist

Before coding, check:

- Which module owns this feature?
- Does a route/controller/service/repository already exist?
- Is validation needed?
- Is database access needed?
- Is this auth-sensitive?
- Does this affect existing API response shape?

---

## After Coding Checklist

After coding, report:

1. Changed files
2. What was added or modified
3. Why the architecture was chosen
4. Any manual checks needed
5. Any migration needed
