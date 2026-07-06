import { RoleCode } from 'generated/prisma/enums'

import { HttpStatus } from '~/core/enums/http-status'
import { HttpException } from '~/core/exceptions'

import type { CreateVetProfileDTO } from './dtos/create-vet-profile.dto'
import type { SearchVetProfileDTO } from './dtos/search-vet-profile.dto'
import type { UpdateVetProfileDTO } from './dtos/update-vet-profile.dto'
import type { VetProfileListResponseDTO, VetProfileResponseDTO } from './dtos/vet-profile-response.dto'
import { vetProfileMapper } from './vet-profile.mapper'
import VetProfileRepository from './vet-profile.repository'
import type { I_VetProfile } from './vet-profile.type'

export default class VetProfileService {
  constructor(private readonly repository: VetProfileRepository) {}

  public async getAll(query: SearchVetProfileDTO): Promise<VetProfileListResponseDTO> {
    const skip = (query.page - 1) * query.limit
    const [vetProfiles, total] = await Promise.all([
      this.repository.findMany({ skip, take: query.limit }),
      this.repository.count()
    ])

    return {
      data: vetProfiles.map(vetProfileMapper),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    }
  }

  public async getById(id: string): Promise<VetProfileResponseDTO> {
    const vetProfile = await this.findExistingVetProfile(id)

    return vetProfileMapper(vetProfile)
  }

  public async create(dto: CreateVetProfileDTO): Promise<VetProfileResponseDTO> {
    this.ensureValidDateRange(dto)
    await this.ensureUserCanOwnVetProfile(dto.user_id)
    await this.ensureLicenseNoIsAvailable(dto.license_no)
    await this.ensureCitizenIdIsAvailable(dto.citizen_id)

    const existingVetProfile = await this.repository.findByUserId(dto.user_id)

    if (existingVetProfile) {
      throw new HttpException(HttpStatus.CONFLICT, 'Vet profile already exists for this user')
    }

    const vetProfile = await this.repository.create(dto)

    return vetProfileMapper(vetProfile)
  }

  public async update(id: string, dto: UpdateVetProfileDTO): Promise<VetProfileResponseDTO> {
    const existingVetProfile = await this.findExistingVetProfile(id)

    if (Object.keys(dto).length === 0) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'At least one field is required')
    }

    this.ensureValidDateRange({
      license_valid_from: dto.license_valid_from ?? existingVetProfile.license_valid_from,
      license_valid_to: dto.license_valid_to ?? existingVetProfile.license_valid_to,
      join_date: dto.join_date ?? existingVetProfile.join_date,
      end_date: dto.end_date === undefined ? existingVetProfile.end_date : dto.end_date
    })

    if (dto.license_no) {
      await this.ensureLicenseNoIsAvailable(dto.license_no, id)
    }

    if (dto.citizen_id) {
      await this.ensureCitizenIdIsAvailable(dto.citizen_id, id)
    }

    const vetProfile = await this.repository.update(id, dto)

    return vetProfileMapper(vetProfile)
  }

  public async delete(id: string): Promise<VetProfileResponseDTO> {
    await this.findExistingVetProfile(id)

    const dependencyCounts = await this.repository.countDependencies(id)
    const hasDependencies = Object.values(dependencyCounts).some((count) => count > 0)

    if (hasDependencies) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Vet profile has related records and cannot be deleted',
        dependencyCounts
      )
    }

    const vetProfile = await this.repository.delete(id)

    return vetProfileMapper(vetProfile)
  }

  private async findExistingVetProfile(id: string): Promise<I_VetProfile> {
    const vetProfile = await this.repository.findById(id)

    if (!vetProfile) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Vet profile not found')
    }

    return vetProfile
  }

  private async ensureUserCanOwnVetProfile(userId: string): Promise<void> {
    const user = await this.repository.findUserById(userId)

    if (!user || user.is_deleted) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found')
    }

    if (user.role !== RoleCode.VET) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'User must have VET role')
    }
  }

  private async ensureLicenseNoIsAvailable(licenseNo: string, currentId?: string): Promise<void> {
    const existingVetProfile = await this.repository.findByLicenseNo(licenseNo)

    if (existingVetProfile && existingVetProfile.id !== currentId) {
      throw new HttpException(HttpStatus.CONFLICT, 'License number already exists')
    }
  }

  private async ensureCitizenIdIsAvailable(citizenId: string, currentId?: string): Promise<void> {
    const existingVetProfile = await this.repository.findByCitizenId(citizenId)

    if (existingVetProfile && existingVetProfile.id !== currentId) {
      throw new HttpException(HttpStatus.CONFLICT, 'Citizen ID already exists')
    }
  }

  private ensureValidDateRange(data: {
    license_valid_from: Date
    license_valid_to: Date
    join_date: Date
    end_date?: Date | null
  }): void {
    if (data.license_valid_from > data.license_valid_to) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'License valid to must be after license valid from')
    }

    if (data.end_date && data.join_date > data.end_date) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'End date must be after join date')
    }
  }
}
