import { Router } from 'express'

import type { IRoute } from '~/core/interfaces'
import { validateBody, validateParams, validateQuery } from '~/core/middlewares/validate.middleware'

import { CreateSpeciesBodyDto } from './dtos/create-species.dto'
import { GetSpeciesQueryDto } from './dtos/search-species.dto'
import { SpeciesIdParamsDto } from './dtos/species-id-params.dto'
import { UpdateSpeciesBodyDto } from './dtos/update-species.dto'
import SpeciesController from './species.controller'

export default class SpeciesRoute implements IRoute {
  public path = '/species'
  public readonly router: Router

  constructor(private readonly speciesController: SpeciesController) {
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    /**
     * @swagger
     * tags:
     *   - name: Species
     *     description: Species related endpoints
     *
     * /species:
     *   get:
     *     tags: [Species]
     *     summary: Get species
     *     parameters:
     *       - $ref: '#/components/parameters/PageQuery'
     *       - $ref: '#/components/parameters/LimitQuery'
     *     responses:
     *       200:
     *         description: Success
     *   post:
     *     tags: [Species]
     *     summary: Create species
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [code, name]
     *             properties:
     *               code:
     *                 type: string
     *                 enum: [DOG, CAT]
     *               name:
     *                 type: string
     *               default_vaccine_plan:
     *                 type: boolean
     *     responses:
     *       201:
     *         description: Created
     *
     * /species/{id}:
     *   get:
     *     tags: [Species]
     *     summary: Get species by id
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     responses:
     *       200:
     *         description: Success
     *   patch:
     *     tags: [Species]
     *     summary: Update species
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
     *     tags: [Species]
     *     summary: Delete species
     *     parameters:
     *       - $ref: '#/components/parameters/IdPath'
     *     responses:
     *       200:
     *         description: Success
     */
    this.router.get(this.path, validateQuery(GetSpeciesQueryDto), this.speciesController.getAll)
    this.router.get(`${this.path}/:id`, validateParams(SpeciesIdParamsDto), this.speciesController.getById)
    this.router.post(this.path, validateBody(CreateSpeciesBodyDto), this.speciesController.create)
    this.router.patch(
      `${this.path}/:id`,
      validateParams(SpeciesIdParamsDto),
      validateBody(UpdateSpeciesBodyDto),
      this.speciesController.update
    )
    this.router.delete(`${this.path}/:id`, validateParams(SpeciesIdParamsDto), this.speciesController.delete)
  }
}
