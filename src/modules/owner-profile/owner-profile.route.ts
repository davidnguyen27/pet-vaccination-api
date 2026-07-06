import { Router } from 'express'

import type { IRoute } from '~/core/interfaces'
import { validateBody, validateParams, validateQuery } from '~/core/middlewares/validate.middleware'

import OwnerProfileController from './owner-profile.controller'
import { CreateOwnerProfileBodyDto } from './dtos/create-owner-profile.dto'
import { OwnerProfileIdParamsDto } from './dtos/owner-profile-id-params.dto'
import { GetOwnerProfilesQueryDto } from './dtos/search-owner-profile.dto'
import { UpdateOwnerProfileBodyDto } from './dtos/update-owner-profile.dto'

export default class OwnerProfileRoute implements IRoute {
  public path = '/owner-profile'
  public readonly router: Router

  constructor(private readonly ownerProfileController: OwnerProfileController) {
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * tags:
     *   - name: OwnerProfile
     *     description: OwnerProfile related endpoints
     *
     * /owner-profile:
     *   get:
     *     tags: [OwnerProfile]
     *     summary: Get owner profiles
     *     parameters:
     *       - $ref: '#/components/parameters/PageQuery'
     *       - $ref: '#/components/parameters/LimitQuery'
     *     responses:
     *       200:
     *         description: Success
     *   post:
     *     tags: [OwnerProfile]
     *     summary: Create owner profile
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [user_id]
     *             properties:
     *               user_id:
     *                 type: string
     *                 format: uuid
     *               address:
     *                 type: string
     *               location_lat:
     *                 type: number
     *               location_lng:
     *                 type: number
     *     responses:
     *       201:
     *         description: Created
     *
     * /owner-profile/{id}:
     *   get:
     *     tags: [OwnerProfile]
     *     summary: Get owner profile by id
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     responses:
     *       200:
     *         description: Success
     *   patch:
     *     tags: [OwnerProfile]
     *     summary: Update owner profile
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Success
     *   delete:
     *     tags: [OwnerProfile]
     *     summary: Delete owner profile
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     responses:
     *       200:
     *         description: Success
     */
    this.router.get(this.path, validateQuery(GetOwnerProfilesQueryDto), this.ownerProfileController.getAll)
    this.router.get(`${this.path}/:id`, validateParams(OwnerProfileIdParamsDto), this.ownerProfileController.getById)
    this.router.post(this.path, validateBody(CreateOwnerProfileBodyDto), this.ownerProfileController.create)
    this.router.patch(
      `${this.path}/:id`,
      validateParams(OwnerProfileIdParamsDto),
      validateBody(UpdateOwnerProfileBodyDto),
      this.ownerProfileController.update
    )
    this.router.delete(`${this.path}/:id`, validateParams(OwnerProfileIdParamsDto), this.ownerProfileController.delete)
  }
}
