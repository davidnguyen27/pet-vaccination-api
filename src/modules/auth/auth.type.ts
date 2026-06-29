import type { RoleCode } from '../../../generated/prisma/enums.js'
import type { LoginInput } from './auth.schema.js'

export type LoginDTO = LoginInput

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

export interface AuthUserResponseDTO {
  id: string
  email: string
  role: RoleCode
  is_active: boolean
  is_deleted: boolean
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
  dob: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  last_login_at: string | null
}

export interface LoginResponseDTO {
  access_token: string
  access_expires_at: string | null
  user: AuthUserResponseDTO
}

export interface AuthJwtPayload {
  sub: string
  email: string
  role: RoleCode
}
