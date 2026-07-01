import { UserResponseDTO } from './user.dto'
import { I_User } from './user.type'

export function userMapper(user: I_User): UserResponseDTO {
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
