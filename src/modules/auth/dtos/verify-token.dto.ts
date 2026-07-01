import { VerifyTokenInput } from '../auth.schema'

export type VerifyTokenDTO = VerifyTokenInput

export interface VerifyTokenResponseDTO {
  verified: boolean
}
