# 10-express-project.md

## Express Project Rules

This project uses Express.js as the HTTP server framework.

---

## Route Rules

Routes only define:

- HTTP method
- Endpoint path
- Middleware
- Controller method

Routes must not contain:

- Business logic
- Prisma queries
- Password hashing
- Token generation
- Complex condition handling
- Response formatting logic

Good:

```ts
router.post(
  '/users',
  validateRequest(createUserSchema),
  userController.create
)
```

Bad:

```ts
router.post('/users', async (req, res) => {
  const user = await prisma.user.create({ data: req.body })
  res.json(user)
})
```

---

## Controller Rules

Controllers are responsible for:

- Reading validated input
- Calling service methods
- Returning HTTP responses
- Passing errors to error middleware

Controllers should stay thin.

Good controller:

```ts
export class UserController {
  constructor(private readonly userService: UserService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.createUser(req.body)
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}
```

---

## Service Rules

Services contain business logic.

Services may:

- Check business rules
- Call repositories
- Hash passwords
- Generate tokens
- Validate domain conditions
- Use transactions through repositories

Services must not:

- Use Express `Request` or `Response`
- Return raw Prisma errors
- Format HTTP responses
- Depend on route/controller details

---

## Repository Rules

Repositories contain database access.

Repositories may:

- Use Prisma client
- Run queries
- Run transactions
- Map database records if needed

Repositories must not:

- Read HTTP request data
- Format HTTP responses
- Contain business decisions
- Generate tokens
- Hash passwords

---

## Middleware Rules

Middleware should be used for:

- Authentication
- Authorization
- Request validation
- Error handling
- Rate limiting if needed
- Request logging if configured

Middleware should not contain feature-specific business logic.
