import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class VerifyTokenBodyDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  token!: string
}

export type VerifyTokenDTO = VerifyTokenBodyDto

export interface VerifyTokenResponseDTO {
  verified: boolean
}
