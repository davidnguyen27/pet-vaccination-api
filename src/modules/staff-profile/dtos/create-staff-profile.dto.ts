import { Transform, Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength
} from 'class-validator'
import { employment_status, employment_type } from 'generated/prisma/enums'

export class CreateStaffProfileBodyDto {
  @IsUUID()
  user_id!: string

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  code!: string

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

  @IsEnum(employment_type)
  employment_type!: employment_type

  @IsEnum(employment_status)
  employment_status!: employment_status

  @Type(() => Date)
  @IsDate()
  join_date!: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end_date?: Date | null

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  citizen_id!: string

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  notes?: string | null
}

export type CreateStaffProfileDTO = CreateStaffProfileBodyDto
