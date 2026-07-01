import { Router } from 'express'

import { uploadUserAvatar } from '~/core/middlewares/upload.middleware'
import { validateRequest } from '~/core/middlewares/validate.middleware'
import UserRepository from './user.repository'
import UserController from './user.controller'
import UserService from './user.service'
import { createUserSchema, searchUsersSchema, updateUserSchema, userIdParamsRequestSchema } from './user.schema'
import { parseCreateUserFormData } from './user.middleware'

export default class UserRoute {
  public readonly router: Router

  private readonly userRepo: UserRepository
  private readonly userService: UserService
  private readonly userController: UserController

  constructor() {
    this.router = Router()

    this.userRepo = new UserRepository()
    this.userService = new UserService(this.userRepo)
    this.userController = new UserController(this.userService)

    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/', validateRequest(searchUsersSchema), this.userController.getAll)
    this.router.get('/:id', validateRequest(userIdParamsRequestSchema), this.userController.getById)
    this.router.post(
      '/',
      uploadUserAvatar,
      parseCreateUserFormData,
      validateRequest(createUserSchema),
      this.userController.create
    )
    this.router.patch('/:id', uploadUserAvatar, validateRequest(updateUserSchema), this.userController.update)
    this.router.delete('/:id', validateRequest(userIdParamsRequestSchema), this.userController.delete)
  }
}
