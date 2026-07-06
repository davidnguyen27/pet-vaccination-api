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
- Manual validation logic

Good:

```ts
router.post('/users', validateBody(CreateUserBodyDto), userController.create)
router.get('/users', validateQuery(GetUsersQueryDto), userController.getList)
router.get('/users/:userId', validateParams(UserIdParamsDto), userController.getById)
```

Bad:

```ts
router.post('/users', async (req, res) => {
  const user = await prisma.user.create({ data: req.body })
  res.json(user)
})
```

Bad:

```ts
router.post('/users', async (req, res) => {
  if (!req.body.email) {
    return res.status(422).json({ message: 'Email is required' })
  }

  const result = await userService.createUser(req.body)
  res.json(result)
})
```

---

## Validation Middleware Rules

Use `class-validator` DTO classes through validation middleware.

Recommended middleware names:

```txt
validateBody(DtoClass)
validateQuery(DtoClass)
validateParams(DtoClass)
```

The middleware should:

1. Convert plain request data to DTO instance with `class-transformer`.
2. Validate the DTO with `class-validator`.
3. Reject invalid input before the controller.
4. Return the project validation error response shape.
5. Keep behavior consistent across body, query, and params.

Do not instantiate DTOs or run decorator validation manually inside controllers.

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

If the project attaches validated data to a custom request property, use that convention consistently.
Do not introduce a new request shape without updating the shared Express types.

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
- Map DTO input to domain/service input when needed

Services must not:

- Use Express `Request` or `Response`
- Return raw Prisma errors
- Format HTTP responses
- Depend on route/controller details
- Run class-validator decorators directly

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
- Validate request DTOs

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
