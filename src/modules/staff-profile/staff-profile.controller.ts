import type { NextFunction, Request, Response } from 'express'

import { formatPaginationResponse, formatResponse, toPageInfo } from '~/core'

import type { CreateStaffProfileDTO } from './dtos/create-staff-profile.dto'
import type { SearchStaffProfileDTO } from './dtos/search-staff-profile.dto'
import type { StaffProfileIdParamsDto } from './dtos/staff-profile-id-params.dto'
import type { UpdateStaffProfileDTO } from './dtos/update-staff-profile.dto'
import StaffProfileService from './staff-profile.service'

export default class StaffProfileController {
  constructor(private readonly service: StaffProfileService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.validated?.query as SearchStaffProfileDTO
      const response = await this.service.getAll(query)

      res.status(200).json(formatPaginationResponse(response.data, toPageInfo(response.meta)))
    } catch (error) {
      next(error)
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as StaffProfileIdParamsDto
      const response = await this.service.getById(id)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateStaffProfileDTO
      const response = await this.service.create(dto)

      res.status(201).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as StaffProfileIdParamsDto
      const dto = req.body as UpdateStaffProfileDTO
      const response = await this.service.update(id, dto)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as StaffProfileIdParamsDto
      const response = await this.service.delete(id)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }
}
