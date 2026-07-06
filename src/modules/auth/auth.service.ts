import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { env } from '~/core/env'
import { HttpException } from '~/core/exceptions'
import { HttpStatus } from '~/core/enums/http-status'
import { VERIFY_TOKEN_EXPIRES_IN_MS } from '~/core/constants/auth.constant'

import { AuthRepository } from './auth.repository'
import { generateSecureToken, getJwtConfig, getRefreshJwtConfig, hashToken } from './auth.helper'

import type { LoginDTO } from './dtos/login.dto'
import type { VerifyTokenDTO, VerifyTokenResponseDTO } from './dtos/verify-token.dto'
import type { ResendVerifyTokenDTO, ResendVerifyTokenResponseDTO } from './dtos/resend-token.dto'

import type { AuthJwtPayload, AuthRefreshJwtPayload, LoginResult } from './auth.type'
import { authMapper } from './auth.mapper'

type JwtExpires = AuthJwtPayload & {
  exp?: number
}

type RefreshJwtExpires = AuthRefreshJwtPayload & {
  exp?: number
}

export default class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  public async login(dto: LoginDTO, context: { userAgent?: string; ipAddress?: string }): Promise<LoginResult> {
    const user = await this.repository.findUserByEmail(dto.email)

    if (!user || !user.is_active) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Please activate your account first')
    }

    if (user.is_deleted) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Your account has been deleted. Please contact support')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)

    if (!isPasswordValid) {
      throw new HttpException(HttpStatus.UNAUTHORIZED, 'Invalid email or password')
    }

    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    }

    const { secret, expiresIn } = getJwtConfig()
    const accessToken = jwt.sign(payload, secret, { expiresIn })
    const decoded = jwt.decode(accessToken) as JwtExpires | null
    const updatedUser = await this.repository.updateLastLogin(user.id, new Date())

    const refreshPayload: AuthRefreshJwtPayload = { sub: user.id }
    const refreshConfig = getRefreshJwtConfig()
    const refreshToken = jwt.sign(refreshPayload, refreshConfig.secret, { expiresIn: refreshConfig.expiresIn })
    const refreshDecoded = jwt.decode(refreshToken) as RefreshJwtExpires | null
    const refreshExpiresAt = refreshDecoded?.exp
      ? new Date(refreshDecoded.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await this.repository.createRefreshToken({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshExpiresAt,
      userAgent: context.userAgent,
      ipAddress: context.ipAddress
    })

    return {
      response: {
        access_token: accessToken,
        access_expires_at: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
        user: authMapper(updatedUser)
      },
      refreshToken,
      refreshExpiresAt
    }
  }

  public async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.repository.revokeRefreshToken(hashToken(refreshToken), new Date())
    }
  }

  public async verifyToken(dto: VerifyTokenDTO): Promise<VerifyTokenResponseDTO> {
    const verifyToken = await this.repository.findVerifyTokenByHash(hashToken(dto.token))

    if (!verifyToken) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid verification token')
    }

    if (verifyToken.user.is_deleted) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Your account has been deleted. Please contact support')
    }

    if (verifyToken.used_at) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Verification token has already been used')
    }

    if (verifyToken.expires_at.getTime() <= Date.now()) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Verification token has expired')
    }

    const isActivated = await this.repository.activateUserByVerifyToken(verifyToken.id, verifyToken.user_id, new Date())

    if (!isActivated) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Verification token has already been used')
    }

    return { verified: true }
  }

  public async resendVerifyToken(dto: ResendVerifyTokenDTO): Promise<ResendVerifyTokenResponseDTO> {
    const user = await this.repository.findUserForVerificationByEmail(dto.email)

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found')
    }

    if (user.is_deleted) {
      throw new HttpException(HttpStatus.FORBIDDEN, 'Your account has been deleted. Please contact support')
    }

    if (user.is_active) {
      throw new HttpException(HttpStatus.CONFLICT, 'Account is already verified')
    }

    const token = generateSecureToken()
    const sentAt = new Date()
    const expiresAt = new Date(sentAt.getTime() + VERIFY_TOKEN_EXPIRES_IN_MS)

    await this.repository.createVerifyToken({
      userId: user.id,
      tokenHash: hashToken(token),
      redirectUrl: dto.redirect_url,
      expiresAt,
      sentAt
    })

    return {
      expires_at: expiresAt.toISOString(),
      redirect_url: dto.redirect_url ?? null,
      verification_token: env.NODE_ENV === 'production' ? undefined : token
    }
  }
}
