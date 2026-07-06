import type { NextFunction, Request, Response } from 'express'

import { formatResponse } from '~/core'
import { env } from '~/core/env'
import { REFRESH_TOKEN_COOKIE_NAME } from '~/core/constants/auth.constant'

import AuthService from './auth.service'
import type { LoginDTO } from './dtos/login.dto'
import type { VerifyTokenDTO } from './dtos/verify-token.dto'
import type { ResendVerifyTokenDTO } from './dtos/resend-token.dto'

export class AuthController {
  constructor(private readonly service: AuthService) {}

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as LoginDTO
      const result = await this.service.login(dto, {
        userAgent: req.get('user-agent'),
        ipAddress: req.ip
      })

      res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: result.refreshExpiresAt
      })

      res.status(200).json(formatResponse(result.response))
    } catch (error) {
      next(error)
    }
  }

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cookieValue: unknown = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME]
      const refreshToken = typeof cookieValue === 'string' ? cookieValue : undefined

      await this.service.logout(refreshToken)

      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax'
      })

      res.status(200).json(formatResponse(null))
    } catch (error) {
      next(error)
    }
  }

  public verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as VerifyTokenDTO
      const response = await this.service.verifyToken(dto)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }

  public resendVerifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as ResendVerifyTokenDTO
      const response = await this.service.resendVerifyToken(dto)

      res.status(200).json(formatResponse(response))
    } catch (error) {
      next(error)
    }
  }
}
