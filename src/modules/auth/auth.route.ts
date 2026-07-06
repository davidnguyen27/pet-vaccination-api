import { Router } from 'express'

import type { IRoute } from '~/core/interfaces'
import { validateBody } from '~/core/middlewares/validate.middleware'
import { AuthController } from './auth.controller'
import { LoginBodyDto } from './dtos/login.dto'
import { ResendVerifyTokenBodyDto } from './dtos/resend-token.dto'
import { VerifyTokenBodyDto } from './dtos/verify-token.dto'

export default class AuthRoute implements IRoute {
  public path = '/auth'
  public readonly router = Router()

  constructor(private readonly authController: AuthController) {
    this.router = Router()
    this.initRoutes()
  }

  private initRoutes(): void {
    /**
     * @swagger
     * tags:
     *   - name: Auth
     *     description: Auth related endpoints
     *
     * /auth/login:
     *   post:
     *     tags: [Auth]
     *     summary: Login
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [email, password]
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Success
     *
     * /auth/logout:
     *   post:
     *     tags: [Auth]
     *     summary: Logout
     *     security: []
     *     responses:
     *       200:
     *         description: Success
     *
     * /auth/verify-token:
     *   post:
     *     tags: [Auth]
     *     summary: Verify account token
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [token]
     *             properties:
     *               token:
     *                 type: string
     *     responses:
     *       200:
     *         description: Success
     *
     * /auth/resend-token:
     *   post:
     *     tags: [Auth]
     *     summary: Resend verification token
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [email]
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               redirect_url:
     *                 type: string
     *                 format: uri
     *     responses:
     *       200:
     *         description: Success
     */
    this.router.post(`${this.path}/login`, validateBody(LoginBodyDto), this.authController.login)
    this.router.post(`${this.path}/logout`, this.authController.logout)
    this.router.post(`${this.path}/verify-token`, validateBody(VerifyTokenBodyDto), this.authController.verifyToken)
    this.router.post(
      `${this.path}/resend-token`,
      validateBody(ResendVerifyTokenBodyDto),
      this.authController.resendVerifyToken
    )
  }
}
