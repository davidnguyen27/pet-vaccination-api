import type { NextFunction, Request, Response } from 'express'

import { formatPaginationResponse, formatResponse, toPageInfo } from '~/core'

import type { CreateOwnerProfileDTO } from './dtos/create-owner-profile.dto'
import type { OwnerProfileIdParamsDto } from './dtos/owner-profile-id-params.dto'
import type { SearchOwnerProfileDTO } from './dtos/search-owner-profile.dto'
import type { UpdateOwnerProfileDTO } from './dtos/update-owner-profile.dto'
import OwnerProfileService from './owner-profile.service'

export default class OwnerProfileController {
  constructor(private readonly service: OwnerProfileService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.validated?.query as SearchOwnerProfileDTO
      const response = await this.service.getAll(query)

      res.status(200).json(formatPaginationResponse(response.data, toPageInfo(response.meta)))
    } catch (error) {
      next(error)
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as OwnerProfileIdParamsDto
      const response = await this.service.getById(id)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateOwnerProfileDTO
      const response = await this.service.create(dto)

      res.status(201).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as OwnerProfileIdParamsDto
      const dto = req.body as UpdateOwnerProfileDTO
      const response = await this.service.update(id, dto)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as OwnerProfileIdParamsDto
      const response = await this.service.delete(id)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }
}
