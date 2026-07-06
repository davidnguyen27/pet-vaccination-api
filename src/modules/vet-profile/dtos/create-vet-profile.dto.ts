import { Transform, Type } from 'class-transformer'
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'
import { employment_status } from 'generated/prisma/enums'

export class CreateVetProfileBodyDto {
  @IsUUID()
  user_id!: string

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bio!: string

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  license_no!: string

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  license_issue_by!: string

  @Type(() => Date)
  @IsDate()
  license_valid_from!: Date

  @Type(() => Date)
  @IsDate()
  license_valid_to!: Date

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

  @IsEnum(employment_status)
  employment_status!: employment_status
}

export type CreateVetProfileDTO = CreateVetProfileBodyDto
