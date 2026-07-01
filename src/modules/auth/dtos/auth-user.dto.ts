import { RoleCode } from 'generated/prisma/enums'

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
