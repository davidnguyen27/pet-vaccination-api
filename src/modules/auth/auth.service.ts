import bcrypt from 'bcryptjs'
import jwt, { type SignOptions } from 'jsonwebtoken'

import { env } from '../../core/env/index.js'
import { AppError } from '../../core/errors/app-error.js'
import type { AuthRepository } from './auth.repository.js'
import type {
  AuthJwtPayload,
  AuthUserPublicRecord,
  AuthUserResponseDTO,
  LoginDTO,
  LoginResponseDTO
} from './auth.type.js'

type JwtWithExp = AuthJwtPayload & {
  exp?: number
}

function getJwtConfig(): { secret: string; expiresIn: SignOptions['expiresIn'] } {
  return {
    secret: env.JWT_ACCESS_SECRET,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn']
  }
}

function toAuthUserResponse(user: AuthUserPublicRecord): AuthUserResponseDTO {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    is_deleted: user.is_deleted,
    full_name: user.full_name,
    phone_number: user.phone_number,
    avatar_url: user.avatar_url,
    dob: user.dob?.toISOString() ?? null,
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
    deleted_at: user.deleted_at?.toISOString() ?? null,
    last_login_at: user.last_login_at?.toISOString() ?? null
  }
}

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async login(dto: LoginDTO): Promise<LoginResponseDTO> {
    const user = await this.repository.findUserByEmail(dto.email)

    if (!user || !user.is_active) {
      throw new AppError('Invalid email or password', 401)
    }

    if (user.is_deleted) {
      throw new AppError('Your account has been deleted. Please contact support.', 403)
    }

    const is_password_valid = await bcrypt.compare(dto.password, user.password)

    if (!is_password_valid) {
      throw new AppError('Invalid email or password', 401)
    }

    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role
    }

    const { secret, expiresIn } = getJwtConfig()
    const access_token = jwt.sign(payload, secret, { expiresIn })
    const decoded = jwt.decode(access_token) as JwtWithExp | null
    const updated_user = await this.repository.updateLastLogin(user.id, new Date())

    return {
      access_token,
      access_expires_at: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null,
      user: toAuthUserResponse(updated_user)
    }
  }

  logout(): null {
    return null
  }
}
