import type { NextFunction, Request, Response } from 'express'

import { formatPaginationResponse, formatResponse, toPageInfo } from '~/core'

import type { CreateUserDTO, SearchUserDTO, UpdateUserDTO, UserAvatarUploadDTO, UserIdParamsDto } from './user.dto'
import UserService from './user.service'

export default class UserController {
  constructor(private readonly service: UserService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.validated?.query as SearchUserDTO
      const response = await this.service.getAll(query)

      res.status(200).json(formatPaginationResponse(response.data, toPageInfo(response.meta)))
    } catch (error) {
      next(error)
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as UserIdParamsDto
      const response = await this.service.getById(id)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateUserDTO
      const avatarFile = this.getAvatarFile(req)

      const response = await this.service.create(dto, avatarFile)

      res.status(201).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as UserIdParamsDto
      const dto = req.body as UpdateUserDTO
      const avatarFile = this.getAvatarFile(req)
      const response = await this.service.update(id, dto, avatarFile)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as UserIdParamsDto
      const response = await this.service.delete(id)

      res.status(200).json(formatResponse(response))
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
