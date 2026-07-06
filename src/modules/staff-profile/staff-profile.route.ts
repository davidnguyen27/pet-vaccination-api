import { Router } from 'express'

import type { IRoute } from '~/core/interfaces'
import { validateBody, validateParams, validateQuery } from '~/core/middlewares/validate.middleware'

import StaffProfileController from './staff-profile.controller'
import { CreateStaffProfileBodyDto } from './dtos/create-staff-profile.dto'
import { GetStaffProfilesQueryDto } from './dtos/search-staff-profile.dto'
import { StaffProfileIdParamsDto } from './dtos/staff-profile-id-params.dto'
import { UpdateStaffProfileBodyDto } from './dtos/update-staff-profile.dto'

export default class StaffProfileRoute implements IRoute {
  public path = '/staff-profile'
  public readonly router: Router

  constructor(private readonly staffProfileController: StaffProfileController) {
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * tags:
     *   - name: StaffProfile
     *     description: StaffProfile related endpoints
     *
     * /staff-profile:
     *   get:
     *     tags: [StaffProfile]
     *     summary: Get staff profiles
     *     parameters:
     *       - $ref: '#/components/parameters/PageQuery'
     *       - $ref: '#/components/parameters/LimitQuery'
     *     responses:
     *       200:
     *         description: Success
     *   post:
     *     tags: [StaffProfile]
     *     summary: Create staff profile
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [user_id, code, employment_type, employment_status, join_date, address, citizen_id]
     *             properties:
     *               user_id:
     *                 type: string
     *                 format: uuid
     *               code:
     *                 type: string
     *               employment_type:
     *                 type: string
     *                 enum: [FULL_TIME, PART_TIME]
     *               employment_status:
     *                 type: string
     *                 enum: [WORKING, ON_LEAVE]
     *               join_date:
     *                 type: string
     *                 format: date-time
     *               address:
     *                 type: string
     *               citizen_id:
     *                 type: string
     *     responses:
     *       201:
     *         description: Created
     *
     * /staff-profile/{id}:
     *   get:
     *     tags: [StaffProfile]
     *     summary: Get staff profile by id
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     responses:
     *       200:
     *         description: Success
     *   patch:
     *     tags: [StaffProfile]
     *     summary: Update staff profile
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
     *     tags: [StaffProfile]
     *     summary: Delete staff profile
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     responses:
     *       200:
     *         description: Success
     */
    this.router.get(this.path, validateQuery(GetStaffProfilesQueryDto), this.staffProfileController.getAll)
    this.router.get(`${this.path}/:id`, validateParams(StaffProfileIdParamsDto), this.staffProfileController.getById)
    this.router.post(this.path, validateBody(CreateStaffProfileBodyDto), this.staffProfileController.create)
    this.router.patch(
      `${this.path}/:id`,
      validateParams(StaffProfileIdParamsDto),
      validateBody(UpdateStaffProfileBodyDto),
      this.staffProfileController.update
    )
    this.router.delete(`${this.path}/:id`, validateParams(StaffProfileIdParamsDto), this.staffProfileController.delete)
  }
}
