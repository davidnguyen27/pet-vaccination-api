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

If an existing controller intentionally omits `message`, document and preserve the existing response contract.
Do not change API response shape without mentioning it.

---

## Status Code Rules

Use correct HTTP status codes:

```txt
200 OK                    -> successful read/update
201 Created               -> successful creation
204 No Content            -> successful deletion with no body
400 Bad Request           -> invalid request
401 Unauthorized          -> not logged in or invalid token
403 Forbidden             -> logged in but not allowed
404 Not Found             -> resource not found
409 Conflict              -> duplicate or business conflict
422 Unprocessable Entity  -> validation failed
500 Internal Server Error -> unexpected server error
```

---

## Validation Rules

Every external input must be validated.

Validate:

- `req.body`
- `req.params`
- `req.query`
- cookies when needed
- file upload metadata if applicable

Use DTO classes with `class-validator` and `class-transformer`.

Recommended files:

```txt
user.dto.ts
auth.dto.ts
appointment.dto.ts
microchip.dto.ts
```

Recommended DTO naming:

```txt
CreateUserBodyDto
UpdateUserBodyDto
GetUsersQueryDto
UserIdParamsDto
LoginBodyDto
```

Use suffixes such as `BodyDto`, `QueryDto`, and `ParamsDto` when a module validates multiple request sources.

---

## DTO Example

```ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserBodyDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string

  @IsString()
  @IsNotEmpty()
  roleCode!: string
}
```

Query DTO example:

```ts
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class GetUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  sortBy?: string

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc'
}
```

Params DTO example:

```ts
import { IsUUID } from 'class-validator'

export class UserIdParamsDto {
  @IsUUID()
  userId!: string
}
```

---

## Validation Middleware Rules

Validation middleware should:

1. Use `plainToInstance` from `class-transformer`.
2. Use `validate` or `validateSync` from `class-validator`.
3. Use `whitelist: true` to remove unknown properties.
4. Prefer `forbidNonWhitelisted: true` when the API should reject extra fields.
5. Return validation errors using the project error response format.
6. Keep body, query, and params validation behavior consistent.

For query and params, remember that Express receives values as strings.
Use `@Type(() => Number)`, `@Type(() => Boolean)`, or custom transforms when type conversion is required.

If decorators are not working, check `tsconfig.json` for decorator support before changing validation code.

---

## Pagination Rules

For list APIs, document and support only the pagination fields implemented by the route and DTO.

Common fields:

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
Do not add unsupported filters just because they are common.
