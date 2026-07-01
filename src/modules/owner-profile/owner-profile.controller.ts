import type { NextFunction, Request, Response } from 'express'

import type { CreateOwnerProfileDTO } from './dtos/create-owner-profile.dto'
import type { SearchOwnerProfileDTO } from './dtos/search-owner-profile.dto'
import type { UpdateOwnerProfileDTO } from './dtos/update-owner-profile.dto'
import type { OwnerProfileIdParamsInput } from './owner-profile.schema'
import OwnerProfileService from './owner-profile.service'

export default class OwnerProfileController {
  constructor(private readonly service: OwnerProfileService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.validated?.query as SearchOwnerProfileDTO
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
      const { id } = req.params as OwnerProfileIdParamsInput
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
      const dto = req.body as CreateOwnerProfileDTO
      const response = await this.service.create(dto)

      res.status(201).json({
        success: true,
        message: 'Create owner profile successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as OwnerProfileIdParamsInput
      const dto = req.body as UpdateOwnerProfileDTO
      const response = await this.service.update(id, dto)

      res.status(200).json({
        success: true,
        message: 'Update owner profile successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as OwnerProfileIdParamsInput
      const response = await this.service.delete(id)

      res.status(200).json({
        success: true,
        message: 'Delete owner profile successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }
}
