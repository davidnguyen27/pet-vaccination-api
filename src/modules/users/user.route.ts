import { Router } from 'express'

import type { IRoute } from '~/core/interfaces'
import { uploadUserAvatar } from '~/core/middlewares/upload.middleware'
import { validateBody, validateParams, validateQuery } from '~/core/middlewares/validate.middleware'
import UserController from './user.controller'
import { parseCreateUserFormData } from './user.middleware'
import { CreateUserBodyDto, GetUsersQueryDto, UpdateUserBodyDto, UserIdParamsDto } from './user.dto'

export default class UserRoute implements IRoute {
  public path = '/users'
  public readonly router: Router

  constructor(private readonly userController: UserController) {
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * tags:
     *   - name: Users
     *     description: Users related endpoints
     *
     * /users:
     *   get:
     *     tags: [Users]
     *     summary: Get users
     *     parameters:
     *       - $ref: '#/components/parameters/PageQuery'
     *       - $ref: '#/components/parameters/LimitQuery'
     *     responses:
     *       200:
     *         description: Success
     *   post:
     *     tags: [Users]
     *     summary: Create user
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required: [email, password]
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *               role:
     *                 type: string
     *                 enum: [ADMIN, STAFF, VET, OWNER]
     *               full_name:
     *                 type: string
     *               phone_number:
     *                 type: string
     *               avatar:
     *                 type: string
     *                 format: binary
     *               dob:
     *                 type: string
     *                 format: date-time
     *     responses:
     *       201:
     *         description: Created
     *
     * /users/{id}:
     *   get:
     *     tags: [Users]
     *     summary: Get user by id
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     responses:
     *       200:
     *         description: Success
     *   patch:
     *     tags: [Users]
     *     summary: Update user
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Success
     *   delete:
     *     tags: [Users]
     *     summary: Delete user
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     responses:
     *       200:
     *         description: Success
     */
    this.router.get(this.path, validateQuery(GetUsersQueryDto), this.userController.getAll)
    this.router.get(`${this.path}/:id`, validateParams(UserIdParamsDto), this.userController.getById)
    this.router.post(
      this.path,
      uploadUserAvatar,
      parseCreateUserFormData,
      validateBody(CreateUserBodyDto),
      this.userController.create
    )
    this.router.patch(
      `${this.path}/:id`,
      uploadUserAvatar,
      validateParams(UserIdParamsDto),
      validateBody(UpdateUserBodyDto),
      this.userController.update
    )
    this.router.delete(`${this.path}/:id`, validateParams(UserIdParamsDto), this.userController.delete)
  }
}
