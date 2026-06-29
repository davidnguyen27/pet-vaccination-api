import { Router } from 'express'

import { validateRequest } from '../../core/middlewares/validate-request.middleware.js'
import { AuthController } from './auth.controller.js'
import { AuthRepository } from './auth.repository.js'
import { loginSchema } from './auth.schema.js'
import { AuthService } from './auth.service.js'

export const authRouter = Router()

const authRepository = new AuthRepository()
const authService = new AuthService(authRepository)
const authController = new AuthController(authService)

authRouter.post('/login', validateRequest(loginSchema), authController.login)
authRouter.post('/logout', authController.logout)
