import { Router } from 'express'

import { validateRequest } from '~/core/middlewares/validate.middleware'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { loginSchema, resendVerifyTokenSchema, verifyTokenSchema } from './auth.schema'
import AuthService from './auth.service'

export default class AuthRoute {
  public readonly router = Router()

  private readonly authRepo: AuthRepository
  private readonly authService: AuthService
  private readonly authController: AuthController

  constructor() {
    this.router = Router()

    this.authRepo = new AuthRepository()
    this.authService = new AuthService(this.authRepo)
    this.authController = new AuthController(this.authService)

    this.initRoutes()
  }

  private initRoutes(): void {
    this.router.post('/login', validateRequest(loginSchema), this.authController.login)
    this.router.post('/logout', this.authController.logout)
    this.router.post('/verify-token', validateRequest(verifyTokenSchema), this.authController.verifyToken)
    this.router.post('/resend-token', validateRequest(resendVerifyTokenSchema), this.authController.resendVerifyToken)
  }
}
