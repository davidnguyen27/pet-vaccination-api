# 30-prisma-database.md

## Prisma Database Rules

This project uses Prisma ORM with PostgreSQL.

---

## Prisma Client Rule

Prisma client must be initialized in one shared file:

```txt
src/core/db/prisma.ts
```

Example:

```ts
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

Do not create multiple PrismaClient instances across modules.

---

## Repository Access

Only repository files should directly import Prisma.

Allowed:

```txt
*.repository.ts
```

Avoid Prisma import in:

```txt
*.route.ts
*.controller.ts
*.service.ts
*.dto.ts
```

Service may use repository transaction methods, but should not call Prisma directly.

---

## DTO And Database Boundary

DTO classes are for request validation only.

Do not treat DTO classes as Prisma models.
Do not import Prisma into DTO files.
Do not pass raw request DTOs directly into Prisma when mapping or filtering is needed.

Preferred flow:

```txt
DTO -> controller/service input -> repository method -> Prisma data
```

The service or repository should map request fields to database fields when needed.

---

## Query Naming

Repository methods should describe intent, not raw database action.

Good:

```ts
findByEmail
findActiveUsers
findByIdOrThrow
createUser
updatePassword
```

Bad:

```ts
query1
getData
doCreate
handleUser
```

---

## Transaction Rules

Use transactions when multiple database writes must succeed or fail together.

Examples:

- Create appointment and appointment detail
- Create vaccination record and update pet vaccination status
- Create microchip record and link it to pet
- Create user and staff profile

Transaction should be handled in repository or a dedicated transaction helper.

---

## Migration Rules

When changing Prisma schema:

1. Update `prisma/schema.prisma`.
2. Run migration.
3. Regenerate Prisma client.
4. Update affected repository types.
5. Update API response if needed.

Commands:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

---

## Data Safety Rules

Before deleting data, consider soft delete if the data is important.

For clinic systems, prefer soft delete for:

- Users
- Pets
- Owners
- Staff
- Veterinarians
- Appointments
- Vaccination records
- Microchip records

Example fields:

```prisma
isActive  Boolean  @default(true)
deletedAt DateTime?
```
