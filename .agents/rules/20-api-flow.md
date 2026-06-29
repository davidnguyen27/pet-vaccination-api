# 20-api-flow.md

## API Design Rules

Use predictable REST API conventions.

---

## Endpoint Naming

Prefer plural nouns:

```txt
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

For nested resources:

```txt
GET  /pets/:petId/vaccinations
POST /pets/:petId/vaccinations
```

For action-based endpoints, use clear action names:

```txt
POST /auth/login
POST /auth/logout
POST /auth/refresh-token
POST /microchips/scan
```

---

## Response Format

Use a consistent response shape.

Success:

```ts
{
  success: true,
  message: string,
  data: T
}
```

Paginated success:

```ts
{
  success: true,
  message: string,
  data: T[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

Error:

```ts
{
  success: false,
  message: string,
  errors?: unknown
}
```

---

## Status Code Rules

Use correct HTTP status codes:

```txt
200 OK                   -> successful read/update
201 Created              -> successful creation
204 No Content           -> successful deletion with no body
400 Bad Request          -> invalid request
401 Unauthorized         -> not logged in or invalid token
403 Forbidden            -> logged in but not allowed
404 Not Found            -> resource not found
409 Conflict             -> duplicate or business conflict
422 Unprocessable Entity -> validation failed
500 Internal Server Error -> unexpected server error
```

---

## Validation Rules

Every external input must be validated.

Validate:

- `req.body`
- `req.params`
- `req.query`
- file upload metadata if applicable

Use Zod schema files:

```txt
user.schema.ts
auth.schema.ts
appointment.schema.ts
microchip.schema.ts
```

Example:

```ts
import { z } from 'zod'

export const createUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    roleCode: z.string().min(1)
  })
})

export type CreateUserInput = z.infer<typeof createUserSchema>['body']
```

---

## Pagination Rules

For list APIs, use:

```txt
page
limit
search
sortBy
sortOrder
```

Example query:

```txt
GET /users?page=1&limit=10&search=anh
```

Service should normalize pagination values before passing to repository.
