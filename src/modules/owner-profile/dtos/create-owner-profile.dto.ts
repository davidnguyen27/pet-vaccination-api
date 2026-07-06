import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator'

function toOptionalNumber(value: unknown): unknown {
  if (value === null || value === undefined) return value
  return typeof value === 'string' || typeof value === 'number' ? Number(value) : value
}

export class CreateOwnerProfileBodyDto {
  @IsUUID()
  user_id!: string

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(255)
  address?: string | null

  @IsOptional()
  @Transform(({ value }) => toOptionalNumber(value))
  @IsNumber()
  @Min(-90)
  @Max(90)
  location_lat?: number | null

  @IsOptional()
  @Transform(({ value }) => toOptionalNumber(value))
  @IsNumber()
  @Min(-180)
  @Max(180)
  location_lng?: number | null
}

export type CreateOwnerProfileDTO = CreateOwnerProfileBodyDto
