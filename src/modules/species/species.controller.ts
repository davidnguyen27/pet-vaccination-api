import type { NextFunction, Request, Response } from 'express'

import type { CreateSpeciesDTO } from './dtos/create-species.dto'
import type { SearchSpeciesDTO } from './dtos/search-species.dto'
import type { UpdateSpeciesDTO } from './dtos/update-species.dto'
import SpeciesService from './species.service'
import type { SpeciesIdParamsInput } from './species.schema'

export default class SpeciesController {
  constructor(private readonly service: SpeciesService) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.validated?.query as SearchSpeciesDTO
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
      const { id } = req.params as SpeciesIdParamsInput
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
      const dto = req.body as CreateSpeciesDTO
      const response = await this.service.create(dto)

      res.status(201).json({
        success: true,
        message: 'Create species successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as SpeciesIdParamsInput
      const dto = req.body as UpdateSpeciesDTO
      const response = await this.service.update(id, dto)

      res.status(200).json({
        success: true,
        message: 'Update species successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as SpeciesIdParamsInput
      const response = await this.service.delete(id)

      res.status(200).json({
        success: true,
        message: 'Delete species successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }
}
