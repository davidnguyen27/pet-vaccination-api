import { RoleCode } from 'generated/prisma/enums'

import { HttpStatus } from '~/core/enums/http-status'
import { HttpException } from '~/core/exceptions'

import type { CreateOwnerProfileDTO } from './dtos/create-owner-profile.dto'
import type { OwnerProfileListResponseDTO, OwnerProfileResponseDTO } from './dtos/owner-profile-response.dto'
import type { SearchOwnerProfileDTO } from './dtos/search-owner-profile.dto'
import type { UpdateOwnerProfileDTO } from './dtos/update-owner-profile.dto'
import { ownerProfileMapper } from './owner-profile.mapper'
import OwnerProfileRepository from './owner-profile.repository'

export default class OwnerProfileService {
  constructor(private readonly repository: OwnerProfileRepository) {}

  public async getAll(query: SearchOwnerProfileDTO): Promise<OwnerProfileListResponseDTO> {
    const skip = (query.page - 1) * query.limit
    const [ownerProfiles, total] = await Promise.all([
      this.repository.findMany({ skip, take: query.limit }),
      this.repository.count()
    ])

    return {
      data: ownerProfiles.map(ownerProfileMapper),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    }
  }

  public async getById(id: string): Promise<OwnerProfileResponseDTO> {
    const ownerProfile = await this.repository.findById(id)

    if (!ownerProfile) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'Owner profile not found')
    }

    return ownerProfileMapper(ownerProfile)
  }

  public async create(dto: CreateOwnerProfileDTO): Promise<OwnerProfileResponseDTO> {
    await this.ensureUserCanOwnProfile(dto.user_id)

    const existingOwnerProfile = await this.repository.findByUserId(dto.user_id)

    if (existingOwnerProfile) {
      throw new HttpException(HttpStatus.CONFLICT, 'Owner profile already exists for this user')
    }

    const ownerProfile = await this.repository.create(dto)

    return ownerProfileMapper(ownerProfile)
  }

  public async update(id: string, dto: UpdateOwnerProfileDTO): Promise<OwnerProfileResponseDTO> {
    await this.getById(id)

    if (Object.keys(dto).length === 0) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'At least one field is required')
    }

    const ownerProfile = await this.repository.update(id, dto)

    return ownerProfileMapper(ownerProfile)
  }

  public async delete(id: string): Promise<OwnerProfileResponseDTO> {
    await this.getById(id)

    const dependencyCounts = await this.repository.countDependencies(id)
    const hasDependencies = Object.values(dependencyCounts).some((count) => count > 0)

    if (hasDependencies) {
      throw new HttpException(
        HttpStatus.CONFLICT,
        'Owner profile has related records and cannot be deleted',
        dependencyCounts
      )
    }

    const ownerProfile = await this.repository.delete(id)

    return ownerProfileMapper(ownerProfile)
  }

  private async ensureUserCanOwnProfile(userId: string): Promise<void> {
    const user = await this.repository.findUserById(userId)

    if (!user || user.is_deleted) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found')
    }

    if (user.role !== RoleCode.OWNER) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'User must have OWNER role')
    }
  }
}
