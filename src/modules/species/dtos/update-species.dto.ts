import { Transform } from 'class-transformer'
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { species_code } from 'generated/prisma/enums'

export class UpdateSpeciesBodyDto {
  @IsOptional()
  @IsEnum(species_code)
  code?: species_code

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string

  @IsOptional()
  @IsBoolean()
  default_vaccine_plan?: boolean
}

export type UpdateSpeciesDTO = UpdateSpeciesBodyDto
