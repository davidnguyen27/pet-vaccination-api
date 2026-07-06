import { RoleCode } from 'generated/prisma/enums'

import { HttpStatus } from '~/core/enums/http-status'
import { HttpException } from '~/core/exceptions'

import type { CreateStaffProfileDTO } from './dtos/create-staff-profile.dto'
import type { SearchStaffProfileDTO } from './dtos/search-staff-profile.dto'
import type { StaffProfileListResponseDTO, StaffProfileResponseDTO } from './dtos/staff-profile-response.dto'
import type { UpdateStaffProfileDTO } from './dtos/update-staff-profile.dto'
import { staffProfileMapper } from './staff-profile.mapper'
import StaffProfileRepository from './staff-profile.repository'
import type { I_StaffProfile } from './staff-profile.type'

export default class StaffProfileService {
  constructor(private readonly repository: StaffProfileRepository) {}

  public async getAll(query: SearchStaffProfileDTO): Promise<StaffProfileListResponseDTO> {
    const skip = (query.page - 1) * query.limit
    const [staffProfiles, total] = await Promise.all([
      this.repository.findMany({ skip, take: query.limit }),
      this.repository.count()
    ])

    return {
      data: staffProfiles.map(staffProfileMapper),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    }
  }

  public async getById(id: string): Promise<StaffProfileResponseDTO> {
    const staffProfile = await this.findExistingStaffProfile(id)

    return staffProfileMapper(staffProfile)
  }

  public async create(dto: CreateStaffProfileDTO): Promise<StaffProfileResponseDTO> {
    this.ensureValidDateRange(dto)
    await this.ensureUserCanOwnStaffProfile(dto.user_id)
    await this.ensureCodeIsAvailable(dto.code)
    await this.ensureCitizenIdIsAvailable(dto.citizen_id)

    const existingStaffProfile = await this.repository.findByUserId(dto.user_id)

    if (existingStaffProfile) {
      throw new HttpException(HttpStatus.CONFLICT, 'Staff profile already exists for this user')
    }

    const staffProfile = await this.repository.create(dto)

    return staffProfileMapper(staffProfile)
  }

  public async update(id: string, dto: UpdateStaffProfileDTO): Promise<StaffProfileResponseDTO> {
    const existingStaffProfile = await this.findExistingStaffProfile(id)

    if (Object.keys(dto).length === 0) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'At least one field is required')
    }

    this.ensureValidDateRange({
      join_date: dto.join_date ?? existingStaffProfile.join_date,
      end_date: dto.end_date === undefined ? existingStaffProfile.end_date : dto.end_date
    })

    if (dto.code) {
      await this.ensureCodeIsAvailable(dto.code, id)
    }

    if (dto.citizen_id) {
      await this.ensureCitizenIdIsAvailable(dto.citizen_id, id)
    }

    const staffProfile = await this.repository.update(id, dto)

    return staffProfileMapper(staffProfile)
  }

  public async delete(id: string): Promise<StaffProfileResponseDTO> {
    await this.findExistingStaffProfile(id)

    const dependencyCounts = await this.repository.countDependencies(id)
    const hasDependencies = Object.values(dependencyCounts).some((count) => count > 0)

    if (hasDependencies) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Staff profile has related records and cannot be deleted',
        dependencyCounts
      )
    }

    const staffProfile = await this.repository.delete(id)

    return staffProfileMapper(staffProfile)
  }

  private async findExistingStaffProfile(id: string): Promise<I_StaffProfile> {
    const staffProfile = await this.repository.findById(id)

    if (!staffProfile) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Staff profile not found')
    }

    return staffProfile
  }

  private async ensureUserCanOwnStaffProfile(userId: string): Promise<void> {
    const user = await this.repository.findUserById(userId)

    if (!user || user.is_deleted) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found')
    }

    if (user.role !== RoleCode.STAFF) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'User must have STAFF role')
    }
  }

  private async ensureCodeIsAvailable(code: string, currentId?: string): Promise<void> {
    const existingStaffProfile = await this.repository.findByCode(code)

    if (existingStaffProfile && existingStaffProfile.id !== currentId) {
      throw new HttpException(HttpStatus.CONFLICT, 'Staff code already exists')
    }
  }

  private async ensureCitizenIdIsAvailable(citizenId: string, currentId?: string): Promise<void> {
    const existingStaffProfile = await this.repository.findByCitizenId(citizenId)

    if (existingStaffProfile && existingStaffProfile.id !== currentId) {
      throw new HttpException(HttpStatus.CONFLICT, 'Citizen ID already exists')
    }
  }

  private ensureValidDateRange(data: { join_date: Date; end_date?: Date | null }): void {
    if (data.end_date && data.join_date > data.end_date) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'End date must be after join date')
    }
  }
}
