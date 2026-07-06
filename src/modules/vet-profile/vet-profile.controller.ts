import type { NextFunction, Request, Response } from 'express'

import { formatPaginationResponse, formatResponse, toPageInfo } from '~/core'

import type { CreateVetProfileDTO } from './dtos/create-vet-profile.dto'
import type { SearchVetProfileDTO } from './dtos/search-vet-profile.dto'
import type { UpdateVetProfileDTO } from './dtos/update-vet-profile.dto'
import type { VetProfileIdParamsDto } from './dtos/vet-profile-id-params.dto'
import VetProfileService from './vet-profile.service'

export default class VetProfileController {
  constructor(private readonly service: VetProfileService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.validated?.query as SearchVetProfileDTO
      const response = await this.service.getAll(query)

      res.status(200).json(formatPaginationResponse(response.data, toPageInfo(response.meta)))
    } catch (error) {
      next(error)
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as VetProfileIdParamsDto
      const response = await this.service.getById(id)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateVetProfileDTO
      const response = await this.service.create(dto)

      res.status(201).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as VetProfileIdParamsDto
      const dto = req.body as UpdateVetProfileDTO
      const response = await this.service.update(id, dto)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as VetProfileIdParamsDto
      const response = await this.service.delete(id)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }
}
