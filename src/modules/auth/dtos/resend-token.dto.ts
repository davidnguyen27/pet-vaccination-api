import { ResendVerifyTokenInput } from '../auth.schema'

export type ResendVerifyTokenDTO = ResendVerifyTokenInput

export interface ResendVerifyTokenResponseDTO {
  expires_at: string
  redirect_url: string | null
  verification_token?: string
}
