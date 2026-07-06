import { Router } from 'express'

import type { IRoute } from '~/core/interfaces'
import { validateBody, validateParams, validateQuery } from '~/core/middlewares/validate.middleware'

import VetProfileController from './vet-profile.controller'
import { CreateVetProfileBodyDto } from './dtos/create-vet-profile.dto'
import { GetVetProfilesQueryDto } from './dtos/search-vet-profile.dto'
import { UpdateVetProfileBodyDto } from './dtos/update-vet-profile.dto'
import { VetProfileIdParamsDto } from './dtos/vet-profile-id-params.dto'

export default class VetProfileRoute implements IRoute {
  public path = '/vet-profile'
  public readonly router: Router

  constructor(private readonly vetProfileController: VetProfileController) {
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * tags:
     *   - name: VetProfile
     *     description: VetProfile related endpoints
     *
     * /vet-profile:
     *   get:
     *     tags: [VetProfile]
     *     summary: Get vet profiles
     *     parameters:
     *       - $ref: '#/components/parameters/PageQuery'
     *       - $ref: '#/components/parameters/LimitQuery'
     *     responses:
     *       200:
     *         description: Success
     *   post:
     *     tags: [VetProfile]
     *     summary: Create vet profile
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [user_id, bio, license_no, license_issue_by, license_valid_from, license_valid_to, join_date, address, citizen_id, employment_status]
     *             properties:
     *               user_id:
     *                 type: string
     *                 format: uuid
     *               bio:
     *                 type: string
     *               license_no:
     *                 type: string
     *               license_issue_by:
     *                 type: string
     *               license_valid_from:
     *                 type: string
     *                 format: date-time
     *               license_valid_to:
     *                 type: string
     *                 format: date-time
     *               join_date:
     *                 type: string
     *                 format: date-time
     *               address:
     *                 type: string
     *               citizen_id:
     *                 type: string
     *               employment_status:
     *                 type: string
     *                 enum: [WORKING, ON_LEAVE]
     *     responses:
     *       201:
     *         description: Created
     *
     * /vet-profile/{id}:
     *   get:
     *     tags: [VetProfile]
     *     summary: Get vet profile by id
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     responses:
     *       200:
     *         description: Success
     *   patch:
     *     tags: [VetProfile]
     *     summary: Update vet profile
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
     *     tags: [VetProfile]
     *     summary: Delete vet profile
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     responses:
     *       200:
     *         description: Success
     */
    this.router.get(this.path, validateQuery(GetVetProfilesQueryDto), this.vetProfileController.getAll)
    this.router.get(`${this.path}/:id`, validateParams(VetProfileIdParamsDto), this.vetProfileController.getById)
    this.router.post(this.path, validateBody(CreateVetProfileBodyDto), this.vetProfileController.create)
    this.router.patch(
      `${this.path}/:id`,
      validateParams(VetProfileIdParamsDto),
      validateBody(UpdateVetProfileBodyDto),
      this.vetProfileController.update
    )
    this.router.delete(`${this.path}/:id`, validateParams(VetProfileIdParamsDto), this.vetProfileController.delete)
  }
}
