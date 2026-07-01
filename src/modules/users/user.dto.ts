import type { RoleCode } from 'generated/prisma/enums'
import type { CreateUserInput, SearchUserInput, UpdateUserInput } from './user.schema'

export type CreateUserDTO = CreateUserInput
export type SearchUserDTO = SearchUserInput
export type UpdateUserDTO = UpdateUserInput

export interface UserAvatarUploadDTO {
  buffer: Buffer
  mimetype: string
  originalname: string
}

export interface UserResponseDTO {
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

export interface UserListResponseDTO {
  data: UserResponseDTO[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
