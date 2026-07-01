import { LoginInput } from '../auth.schema'
import { AuthUserResponseDTO } from './auth-user.dto'

export type LoginDTO = LoginInput

export interface LoginResponseDTO {
  access_token: string
  access_expires_at: string | null
  user: AuthUserResponseDTO
}
