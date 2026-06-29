import type { NextFunction, Request, Response } from 'express'

import type { AuthService } from './auth.service.js'
import type { LoginDTO } from './auth.type.js'

export class AuthController {
  constructor(private readonly service: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as LoginDTO
      const response = await this.service.login(dto)

      res.status(200).json({
        success: true,
        message: 'Login successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }

  logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = this.service.logout()

      res.clearCookie('refresh_token', {
        httpOnly: true,
        sameSite: 'lax'
      })

      res.status(200).json({
        success: true,
        message: 'Logout successfully',
        data: response
      })
    } catch (error) {
      next(error)
    }
  }
}
