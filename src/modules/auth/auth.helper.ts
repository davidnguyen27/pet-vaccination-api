import type { SignOptions } from 'jsonwebtoken'
import { createHash, randomBytes } from 'node:crypto'
import { env } from '~/core/env'

export function getJwtConfig(): { secret: string; expiresIn: SignOptions['expiresIn'] } {
  return {
    secret: env.JWT_ACCESS_SECRET,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn']
  }
}

export function getRefreshJwtConfig(): { secret: string; expiresIn: SignOptions['expiresIn'] } {
  return {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']
  }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function generateSecureToken(): string {
  return randomBytes(32).toString('hex')
}
