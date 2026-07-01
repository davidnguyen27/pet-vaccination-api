import type { RoleCode } from 'generated/prisma/enums'

export interface I_User {
  id: string
  email: string
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
