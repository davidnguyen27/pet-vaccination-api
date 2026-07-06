# 40-auth-security.md

## Auth And Security Rules

This project uses JWT authentication with refresh token stored in cookie.

---

## Token Rules

Access token:

- Short-lived
- Returned to client if current project design needs it
- Sent through Authorization header as Bearer token

Refresh token:

- Long-lived
- Stored in HTTP-only cookie
- Used only for refreshing access token
- Should not be stored in localStorage

---

## Auth Flow

Login:

```txt
POST /auth/login
-> validate LoginBodyDto
-> validate credentials
-> issue access token
-> set refresh token cookie
-> return user info and access token if needed
```

Refresh token:

```txt
POST /auth/refresh-token
-> read refresh token from cookie
-> verify token
-> issue new access token
```

Logout:

```txt
POST /auth/logout
-> clear refresh token cookie
-> optionally revoke token in database
```

---

## Auth DTO Rules

Use class-validator DTOs for auth request input.

Recommended DTO names:

```txt
LoginBodyDto
RegisterBodyDto
ChangePasswordBodyDto
ForgotPasswordBodyDto
ResetPasswordBodyDto
```

Example:

```ts
import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginBodyDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(8)
  password!: string
}
```

Do not validate tokens, roles, or user identity from request body when they should come from cookie, header, or verified JWT payload.

---

## Password Rules

- Never store plain text passwords.
- Hash password before saving.
- Compare password using a safe password comparison function.
- Do not return password fields in API responses.
- Password fields are allowed in request DTOs only when the endpoint requires them.

---

## Authorization Rules

Authentication answers:

```txt
Who are you?
```

Authorization answers:

```txt
What are you allowed to do?
```

Use role-based checks for:

- Admin
- Staff
- Veterinarian
- Pet owner

Example:

```ts
requireRoles('admin', 'staff')
```

---

## Cookie Rules

For refresh token cookie:

```ts
httpOnly: true
secure: env.NODE_ENV === 'production'
sameSite: 'lax'
```

Use `sameSite: 'none'` only when frontend and backend are on different domains and HTTPS is configured.

---

## Security Anti-Patterns

Do not:

- Store refresh token in localStorage
- Return password hash
- Trust role from request body
- Trust user ID from request body when it should come from token
- Put secret keys directly in code
- Log access tokens or refresh tokens
- Put auth business logic inside DTO classes
