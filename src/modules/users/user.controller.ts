import type { NextFunction, Request, Response } from 'express'

import type { ValidatedRequest } from '~/core/middlewares/validate.middleware'
import type { CreateUserDTO, SearchUserDTO, UpdateUserDTO, UserAvatarUploadDTO } from './user.dto'
import UserService from './user.service'
import type { UserIdParamsInput } from './user.schema'

export default class UserController {
  constructor(private readonly service: UserService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req as ValidatedRequest).validated?.query as SearchUserDTO
      const response = await this.service.getAll(query)

      res.status(200).json({
        success: true,
        data: response.data,
        meta: response.meta
      })
    } catch (error) {
      next(error)
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as UserIdParamsInput
      const response = await this.service.getById(id)

      res.status(200).json({
        success: true,
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateUserDTO
      const avatarFile = this.getAvatarFile(req)

      const response = await this.service.create(dto, avatarFile)

      res.status(201).json({
        success: true,
        message: 'Create user successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as UserIdParamsInput
      const dto = req.body as UpdateUserDTO
      const avatarFile = this.getAvatarFile(req)
      const response = await this.service.update(id, dto, avatarFile)

      res.status(200).json({
        success: true,
        message: 'Update user successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as UserIdParamsInput
      const response = await this.service.delete(id)

      res.status(200).json({
        success: true,
        message: 'Delete user successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  private getAvatarFile(req: Request): UserAvatarUploadDTO | undefined {
    if (!req.file) {
      return undefined
    }

    return {
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname
    }
  }
}
