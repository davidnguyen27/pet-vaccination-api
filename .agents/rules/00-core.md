# 00-core.md

## Core Backend Rules

You are working on an Express.js + TypeScript backend.

Always prioritize:

1. Correctness
2. Maintainability
3. Type safety
4. Clear architecture
5. Minimal changes
6. Consistent naming

---

## Non-Negotiable Rules

- Do not skip layers.
- Do not put business logic in routes.
- Do not use Prisma directly in controllers.
- Do not access environment variables directly outside config/env files.
- Do not introduce new packages without explaining why.
- Do not rewrite large parts of the project unless required.
- Do not change public API contracts without mentioning it.
- Do not add tests unless the user asks.

---

## Preferred Flow

Use this flow for API features:

```txt
route -> validation middleware -> controller -> service -> repository -> prisma
```

Example:

```txt
POST /users
-> validateBody(CreateUserBodyDto)
-> userController.create
-> userService.createUser
-> userRepository.create
-> prisma.user.create
```

---

## Validation Standard

This project uses `class-validator` and `class-transformer` for request validation.

Use DTO classes for external input:

```txt
CreateUserBodyDto
GetUsersQueryDto
UserIdParamsDto
LoginBodyDto
```

Validation must happen in middleware before the controller.

Do not create new Zod schemas.
Do not mix Zod and class-validator in the same feature unless the user explicitly asks for a migration step.

---

## TypeScript Standards

- Prefer `interface` for object shapes.
- Prefer `type` for unions, utility types, and function signatures.
- Avoid `any`.
- Use `unknown` for unknown error values.
- Use explicit return types for exported functions.
- Use DTO classes for validated request input.
- Use response interfaces/types for API output when useful.
- Use definite assignment (`!`) or optional fields (`?`) in DTO classes when needed.
- Keep DTOs at the HTTP boundary. Map DTOs to service input or repository data when needed.

---

## Error Handling

Use centralized error handling.

Do not do this:

```ts
res.status(500).json({ message: 'Something went wrong' })
```

Prefer throwing app-level errors:

```ts
throw new AppError('User not found', 404)
```

Then let global error middleware format the response.

---

## Naming Rules

Use clear and short names.

Recommended file naming:

```txt
user.route.ts
user.controller.ts
user.service.ts
user.repository.ts
user.dto.ts
user.type.ts
```

Recommended class naming:

```txt
UserController
UserService
UserRepository
CreateUserBodyDto
GetUsersQueryDto
UserIdParamsDto
```

Recommended function naming:

```txt
createUser
getUserById
updateUser
deleteUser
findUserByEmail
```
