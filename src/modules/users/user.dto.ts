import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested
} from 'class-validator'
import { RoleCode, employment_status, employment_type } from 'generated/prisma/enums'

function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value
}

function trimLowerString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim().toLowerCase() : value
}

function booleanFromFormData(value: unknown): unknown {
  if (value === 'true') return true
  if (value === 'false') return false
  return value
}

export class UserIdParamsDto {
  @IsUUID()
  id!: string
}

export class GetUsersQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10
}

class CreateUserOwnerProfileBodyDto {
  @IsOptional()
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  location_lat?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  location_lng?: number
}

class CreateUserStaffProfileBodyDto {
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  code!: string

  @IsOptional()
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  job_title?: string

  @IsOptional()
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  department?: string

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
  end_date?: Date

  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string

  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  citizen_id!: string

  @IsOptional()
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  notes?: string
}

class CreateUserVetProfileBodyDto {
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bio!: string

  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  license_no!: string

  @Transform(({ value }) => trimString(value))
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
  end_date?: Date

  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address!: string

  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  citizen_id!: string

  @IsEnum(employment_status)
  employment_status!: employment_status
}

export class CreateUserBodyDto {
  @Transform(({ value }) => trimLowerString(value))
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string

  @IsOptional()
  @IsEnum(RoleCode)
  role?: RoleCode

  @IsOptional()
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  full_name?: string

  @IsOptional()
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone_number?: string

  @IsOptional()
  @Transform(({ value }) => trimString(value))
  @IsUrl()
  @MaxLength(255)
  avatar_url?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date

  @IsOptional()
  @Transform(({ value }) => booleanFromFormData(value))
  @IsBoolean()
  is_active?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserOwnerProfileBodyDto)
  owner?: CreateUserOwnerProfileBodyDto

  @ValidateIf((dto: CreateUserBodyDto) => (dto.role ?? RoleCode.OWNER) === RoleCode.STAFF || dto.staff !== undefined)
  @IsDefined({ message: 'Staff profile is required when role is STAFF' })
  @ValidateNested()
  @Type(() => CreateUserStaffProfileBodyDto)
  staff?: CreateUserStaffProfileBodyDto

  @ValidateIf((dto: CreateUserBodyDto) => (dto.role ?? RoleCode.OWNER) === RoleCode.VET || dto.vet !== undefined)
  @IsDefined({ message: 'Vet profile is required when role is VET' })
  @ValidateNested()
  @Type(() => CreateUserVetProfileBodyDto)
  vet?: CreateUserVetProfileBodyDto
}

export class UpdateUserBodyDto {
  @IsOptional()
  @Transform(({ value }) => trimLowerString(value))
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string

  @IsOptional()
  @IsEnum(RoleCode)
  role?: RoleCode

  @IsOptional()
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  full_name?: string

  @IsOptional()
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone_number?: string

  @IsOptional()
  @Transform(({ value }) => trimString(value))
  @IsUrl()
  @MaxLength(255)
  avatar_url?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date

  @IsOptional()
  @Transform(({ value }) => booleanFromFormData(value))
  @IsBoolean()
  is_active?: boolean
}

export type CreateUserDTO = CreateUserBodyDto
export type SearchUserDTO = GetUsersQueryDto
export type UpdateUserDTO = UpdateUserBodyDto

export interface UserAvatarUploadDTO {
  buffer: Buffer
  mimetype: string
  originalname: string
}

export interface UserResponseDTO {
  id: string
  email: string
  role: RoleCode
  is_active: boolean
  is_deleted: boolean
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
  dob: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  last_login_at: string | null
}

export interface UserListResponseDTO {
  data: UserResponseDTO[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
