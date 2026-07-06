# 50-swagger.md

## Swagger / OpenAPI Rules

Use this file to guide agents when writing Swagger docs for this Express.js + TypeScript backend.

---

## Core Rules

- Document the existing API. Do not redesign the API through Swagger docs.
- Follow the existing project Swagger structure first.
- This project currently has root `swagger.yaml`; reuse it unless the user asks for migration.
- If `swagger.yaml` is generated, update the source config or source YAML files instead of editing generated output directly.
- Prefer YAML docs when adding or updating OpenAPI content.
- Do not write large `@swagger` comments inside route files.
- Route files should only contain method, path, middleware, and controller.
- Docs must match the actual route, DTO validation decorators, auth middleware, role middleware, content type, and controller response.
- Do not invent fields, query params, roles, status codes, or response shapes.
- Reuse `components` for repeated schemas, responses, parameters, and security.

---

## Project Swagger Structure

This project currently keeps the main OpenAPI document at the project root:

```txt
swagger.yaml
```

Agents should update the existing Swagger location first.

Do not create a new `src/core/docs/openapi.yaml` or move Swagger files unless the user explicitly asks for a Swagger docs migration.

If the project has a Swagger config file such as:

```txt
src/core/configs/swagger.config.ts
src/core/swagger.config.ts
src/core/config/swagger.config.ts
```

read it before editing docs.

If `swagger.yaml` is generated from another source, do not edit generated output directly. Update the source Swagger config or source YAML files instead.

---

## OpenAPI Base

Use OpenAPI `3.0.3` unless the existing project already uses another supported version.

```yaml
openapi: 3.0.3

info:
  title: API Documentation
  version: 1.0.0

servers:
  - url: http://localhost:3000/api
    description: Local server

tags: []

paths: {}

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas: {}
  responses: {}
  parameters: {}
```

---

## Naming Convention

```txt
Tags         -> PascalCase nouns: Auth, Users, Pets
operationId -> camelCase: login, getUsers, createUser
Schemas      -> PascalCase: User, LoginBodyDto, CreateUserBodyDto, UserListResponse
Paths        -> actual API paths from route files
```

Prefer plural REST endpoints when they match the actual route:

```txt
GET    /users
GET    /users/{userId}
POST   /users
PATCH  /users/{userId}
DELETE /users/{userId}
```

Action endpoints are allowed for real actions:

```txt
POST /auth/login
POST /auth/logout
POST /auth/refresh-token
POST /microchips/scan
```

Do not rename existing routes just to make Swagger look more RESTful.

---

## Operation Format

Use this order when the fields exist:

```txt
tags -> summary -> description -> operationId -> security -> parameters -> requestBody -> responses
```

GET example:

```yaml
/users:
  get:
    tags:
      - Users
    summary: Get user list
    description: Get users using the filters implemented by the API.
    operationId: getUsers
    security:
      - bearerAuth: []
    parameters:
      - $ref: '#/components/parameters/PageQuery'
      - $ref: '#/components/parameters/LimitQuery'
    responses:
      '200':
        description: Success
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserListResponse'
```

POST example:

```yaml
/users:
  post:
    tags:
      - Users
    summary: Create user
    operationId: createUser
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CreateUserBodyDto'
    responses:
      '201':
        description: Created
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserResponse'
```

Do not add empty `requestBody`, `parameters`, or `security` blocks.

For real endpoints, include `content` and response schema unless the status code is `204`.

---

## Request Rules

- Use `requestBody` only for APIs that actually read body data.
- Use `parameters` only for actual path params and query params.
- Build request schemas from DTO classes and class-validator decorators.
- Document `page`, `limit`, `search`, `sortBy`, and `sortOrder` only when implemented by the route and DTO.
- Do not add unsupported filters just because they are common.
- File upload APIs must use `multipart/form-data`.
- File fields must use `type: string` and `format: binary`.
- Nested data in multipart should be documented as JSON string only if the backend supports it.

---

## DTO To OpenAPI Mapping

Map class-validator decorators to OpenAPI constraints when useful:

```txt
@IsString()       -> type: string
@IsNumber()       -> type: number
@IsInt()          -> type: integer
@IsBoolean()      -> type: boolean
@IsEmail()        -> type: string, format: email
@IsUUID()         -> type: string, format: uuid
@IsDateString()   -> type: string, format: date-time
@MinLength(n)     -> minLength: n
@MaxLength(n)     -> maxLength: n
@Min(n)           -> minimum: n
@Max(n)           -> maximum: n
@IsEnum(Enum)     -> enum: [...]
@IsOptional()     -> omit from required
```

Do not document a field as required if the DTO uses `@IsOptional()`.

---

## Response Rules

Match the controller response exactly.

The project may use these common shapes:

```ts
{ success: true, message: string, data: T }
```

```ts
{
  success: true,
  message: string,
  data: T[],
  meta: { page: number, limit: number, total: number, totalPages: number }
}
```

```ts
{ success: false, message: string, errors?: unknown }
```

If a controller returns `{ success, data, meta }` without `message`, document it without `message`.

Document the status codes actually used by the controller/error layer:

```txt
200 read/update success
201 create success
204 delete success without body
400 bad request
401 unauthenticated
403 forbidden
404 not found
409 conflict
422 validation failed
500 unexpected error
```

Do not document only `200` when the route has meaningful error cases.

---

## Component Rules

Put repeated definitions in `components`.

Common reusable items:

```txt
PageQuery
LimitQuery
ErrorResponse
ValidationErrorResponse
UnauthorizedError
ForbiddenError
NotFoundError
ConflictError
InternalServerError
```

Before adding a new schema, response, or parameter, check if an existing component can be reused.

---

## Auth And Security

Protected APIs must be documented with auth security, either globally or per operation.

Per-operation security example:

```yaml
security:
  - bearerAuth: []
```

If global security is used at root level:

```yaml
security:
  - bearerAuth: []
```

then public APIs must explicitly use:

```yaml
security: []
```

Only document role restrictions that are enforced by middleware or service logic.

Never expose these fields in response schemas:

```txt
password
passwordHash
refreshToken
verifyToken
resetPasswordToken
otpSecret
```

Password is allowed only in request schemas such as login, register, or change password.

---

## Schema Rules

- Schema names should use PascalCase.
- Field names must match the actual API contract exactly.
- Do not convert `snake_case` to `camelCase` or `camelCase` to `snake_case` unless the API actually does that.
- Use response field names, not Prisma model field names, unless the API returns raw Prisma fields.
- Important schemas should include `type`, `properties`, `required`, and realistic examples.
- Examples must not contain real passwords, tokens, or private data.

---

## Agent Workflow

Before editing Swagger docs:

1. Read the module route file, for example `src/modules/users/user.route.ts`.
2. Read the DTO file, for example `src/modules/users/user.dto.ts`.
3. Check class-validator decorators and optional fields.
4. Check auth and role middleware.
5. Check the controller response.
6. Read service logic when business errors, status codes, or role restrictions are unclear.
7. Check request content type.
8. Check the existing Swagger config and root `swagger.yaml`.
9. Update docs in the existing Swagger location.
10. Reuse existing `components`.
11. Verify all `$ref` targets exist.

---

## Final Checklist

- Existing Swagger structure is reused.
- Generated Swagger output is not edited directly.
- YAML indentation is valid.
- Every path starts with `/`.
- Every operation has `tags`, `summary`, `operationId`, and `responses`.
- No empty `requestBody`, `parameters`, or `security` blocks exist.
- Request docs match DTO classes and class-validator decorators.
- Response docs match controller output exactly.
- Query params are documented only when implemented.
- Protected routes include security globally or per operation.
- Public routes override global security with `security: []` when needed.
- Field naming matches the actual API contract.
- Sensitive fields are not exposed.
- File uploads use `multipart/form-data`.
- Common errors and validation errors are documented.
- All `$ref` targets exist.

---

## Commit Messages

```txt
docs: setup swagger docs
docs: add swagger docs for auth APIs
docs: add swagger docs for user APIs
docs: update swagger schemas
docs: update dto validation docs
```
