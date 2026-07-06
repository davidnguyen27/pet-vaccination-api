import type { NextFunction, Request, Response } from 'express'

import { formatPaginationResponse, formatResponse, toPageInfo } from '~/core'

import type { CreateSpeciesDTO } from './dtos/create-species.dto'
import type { SearchSpeciesDTO } from './dtos/search-species.dto'
import type { SpeciesIdParamsDto } from './dtos/species-id-params.dto'
import type { UpdateSpeciesDTO } from './dtos/update-species.dto'
import SpeciesService from './species.service'

export default class SpeciesController {
  constructor(private readonly service: SpeciesService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.validated?.query as SearchSpeciesDTO
      const response = await this.service.getAll(query)

      res.status(200).json(formatPaginationResponse(response.data, toPageInfo(response.meta)))
    } catch (error) {
      next(error)
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as SpeciesIdParamsDto
      const response = await this.service.getById(id)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateSpeciesDTO
      const response = await this.service.create(dto)

      res.status(201).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as SpeciesIdParamsDto
      const dto = req.body as UpdateSpeciesDTO
      const response = await this.service.update(id, dto)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as unknown as SpeciesIdParamsDto
      const response = await this.service.delete(id)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }
}
