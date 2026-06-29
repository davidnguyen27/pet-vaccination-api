import { prisma } from '../../core/db/prisma.js'
import type { AuthUserPublicRecord, AuthUserRecord } from './auth.type.js'

const authUserSelect = {
  id: true,
  email: true,
  password: true,
  role: true,
  is_active: true,
  is_deleted: true,
  full_name: true,
  phone_number: true,
  avatar_url: true,
  dob: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  last_login_at: true
} as const

const authUserPublicSelect = {
  id: true,
  email: true,
  role: true,
  is_active: true,
  is_deleted: true,
  full_name: true,
  phone_number: true,
  avatar_url: true,
  dob: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  last_login_at: true
} as const

export class AuthRepository {
  findUserByEmail(email: string): Promise<AuthUserRecord | null> {
    return prisma.user.findUnique({
      where: { email },
      select: authUserSelect
    })
  }

  updateLastLogin(userId: string, lastLoginAt: Date): Promise<AuthUserPublicRecord> {
    return prisma.user.update({
      where: { id: userId },
      data: { last_login_at: lastLoginAt },
      select: authUserPublicSelect
    })
  }
}
