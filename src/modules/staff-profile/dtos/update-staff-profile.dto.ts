import { Transform, Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { employment_status, employment_type } from 'generated/prisma/enums'

export class UpdateStaffProfileBodyDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  code?: string

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  job_title?: string | null

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  department?: string | null

  @IsOptional()
  @IsEnum(employment_type)
  employment_type?: employment_type

  @IsOptional()
  @IsEnum(employment_status)
  employment_status?: employment_status

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
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  notes?: string | null
}

export type UpdateStaffProfileDTO = UpdateStaffProfileBodyDto
