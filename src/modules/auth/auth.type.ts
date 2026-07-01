import { RoleCode } from 'generated/prisma/enums'
import type { LoginResponseDTO } from './dtos/login.dto'

export interface AuthUserRecord {
  id: string
  email: string
  password: string
  role: RoleCode
  is_active: boolean
  is_deleted: boolean
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
  dob: Date | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
  last_login_at: Date | null
}

export type AuthUserPublicRecord = Omit<AuthUserRecord, 'password'>

export interface LoginResult {
  response: LoginResponseDTO
  refreshToken: string
  refreshExpiresAt: Date
}

export interface AuthJwtPayload {
  sub: string
  email: string
  role: RoleCode
}

export interface AuthRefreshJwtPayload {
  sub: string
}

export interface VerifyTokenRecord {
  id: string
  user_id: string
  expires_at: Date
  used_at: Date | null
  user: {
    id: string
    is_active: boolean
    is_deleted: boolean
  }
}
