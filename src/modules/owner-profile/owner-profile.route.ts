import { Router } from 'express'

import { validateRequest } from '~/core/middlewares/validate.middleware'

import OwnerProfileController from './owner-profile.controller'
import OwnerProfileRepository from './owner-profile.repository'
import {
  createOwnerProfileSchema,
  ownerProfileIdParamsRequestSchema,
  searchOwnerProfilesSchema,
  updateOwnerProfileSchema
} from './owner-profile.schema'
import OwnerProfileService from './owner-profile.service'

export default class OwnerProfileRoute {
  public readonly router: Router

  private readonly ownerProfileRepo: OwnerProfileRepository
  private readonly ownerProfileService: OwnerProfileService
  private readonly ownerProfileController: OwnerProfileController

  constructor() {
    this.router = Router()

    this.ownerProfileRepo = new OwnerProfileRepository()
    this.ownerProfileService = new OwnerProfileService(this.ownerProfileRepo)
    this.ownerProfileController = new OwnerProfileController(this.ownerProfileService)

    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get('/', validateRequest(searchOwnerProfilesSchema), this.ownerProfileController.getAll)
    this.router.get('/:id', validateRequest(ownerProfileIdParamsRequestSchema), this.ownerProfileController.getById)
    this.router.post('/', validateRequest(createOwnerProfileSchema), this.ownerProfileController.create)
    this.router.patch('/:id', validateRequest(updateOwnerProfileSchema), this.ownerProfileController.update)
    this.router.delete('/:id', validateRequest(ownerProfileIdParamsRequestSchema), this.ownerProfileController.delete)
  }
}
