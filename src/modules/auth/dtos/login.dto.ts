import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { AuthUserResponseDTO } from './auth-user.dto'

export class LoginBodyDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}

export type LoginDTO = LoginBodyDto

export interface LoginResponseDTO {
  access_token: string
  access_expires_at: string | null
  user: AuthUserResponseDTO
}
