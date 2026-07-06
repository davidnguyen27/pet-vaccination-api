import { Transform } from 'class-transformer'
import { IsEmail, IsOptional, IsUrl, MaxLength } from 'class-validator'

export class ResendVerifyTokenBodyDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  email!: string

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsUrl()
  @MaxLength(500)
  redirect_url?: string
}

export type ResendVerifyTokenDTO = ResendVerifyTokenBodyDto

export interface ResendVerifyTokenResponseDTO {
  expires_at: string
  redirect_url: string | null
  verification_token?: string
}
