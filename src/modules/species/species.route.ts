import { Router } from 'express'

import { validateRequest } from '~/core/middlewares/validate.middleware'

import SpeciesController from './species.controller'
import SpeciesRepository from './species.repository'
import {
  createSpeciesSchema,
  searchSpeciesSchema,
  speciesIdParamsRequestSchema,
  updateSpeciesSchema
} from './species.schema'
import SpeciesService from './species.service'

export default class SpeciesRoute {
  public readonly router: Router

  private readonly speciesRepo: SpeciesRepository
  private readonly speciesService: SpeciesService
  private readonly speciesController: SpeciesController

  constructor() {
    this.router = Router()

    this.speciesRepo = new SpeciesRepository()
    this.speciesService = new SpeciesService(this.speciesRepo)
    this.speciesController = new SpeciesController(this.speciesService)

    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/', validateRequest(searchSpeciesSchema), this.speciesController.getAll)
    this.router.get('/:id', validateRequest(speciesIdParamsRequestSchema), this.speciesController.getById)
    this.router.post('/', validateRequest(createSpeciesSchema), this.speciesController.create)
    this.router.patch('/:id', validateRequest(updateSpeciesSchema), this.speciesController.update)
    this.router.delete('/:id', validateRequest(speciesIdParamsRequestSchema), this.speciesController.delete)
  }
}
