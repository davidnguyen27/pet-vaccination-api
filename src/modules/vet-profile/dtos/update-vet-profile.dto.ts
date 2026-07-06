import { Transform, Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { employment_status } from 'generated/prisma/enums'

export class UpdateVetProfileBodyDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bio?: string

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  license_no?: string

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  license_issue_by?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  license_valid_from?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  license_valid_to?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  join_date?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end_date?: Date | null

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address?: string

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  citizen_id?: string

  @IsOptional()
  @IsEnum(employment_status)
  employment_status?: employment_status
}

export type UpdateVetProfileDTO = UpdateVetProfileBodyDto
