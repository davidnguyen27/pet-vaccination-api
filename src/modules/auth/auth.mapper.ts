import { AuthUserPublicRecord } from './auth.type'
import { AuthUserResponseDTO } from './dtos/auth-user.dto'

export function authMapper(user: AuthUserPublicRecord): AuthUserResponseDTO {
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
