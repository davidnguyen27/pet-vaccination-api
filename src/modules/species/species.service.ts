import { AppError } from '~/core/errors'
import { HttpStatus } from '~/core/enums/http-status'

import type { CreateSpeciesDTO } from './dtos/create-species.dto'
import type { SearchSpeciesDTO } from './dtos/search-species.dto'
import type { SpeciesListResponseDTO, SpeciesResponseDTO } from './dtos/species-response.dto'
import type { UpdateSpeciesDTO } from './dtos/update-species.dto'
import { speciesMapper } from './species.mapper'
import SpeciesRepository from './species.repository'

export default class SpeciesService {
  constructor(private readonly repository: SpeciesRepository) {}

  public async getAll(query: SearchSpeciesDTO): Promise<SpeciesListResponseDTO> {
    const skip = (query.page - 1) * query.limit
    const [species, total] = await Promise.all([
      this.repository.findMany({ skip, take: query.limit }),
      this.repository.count()
    ])

    return {
      data: species.map(speciesMapper),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    }
  }

  public async getById(id: string): Promise<SpeciesResponseDTO> {
    const species = await this.repository.findById(id)

    if (!species) {
      throw new AppError('Species not found', HttpStatus.NOT_FOUND)
    }

    return speciesMapper(species)
  }

  public async create(dto: CreateSpeciesDTO): Promise<SpeciesResponseDTO> {
    await this.ensureCodeIsAvailable(dto.code)
    await this.ensureNameIsAvailable(dto.name)

    const species = await this.repository.create(dto)

    return speciesMapper(species)
  }

  public async update(id: string, dto: UpdateSpeciesDTO): Promise<SpeciesResponseDTO> {
    await this.getById(id)

    if (Object.keys(dto).length === 0) {
      throw new AppError('At least one field is required', HttpStatus.BAD_REQUEST)
    }

    if (dto.code) {
      await this.ensureCodeIsAvailable(dto.code, id)
    }

    if (dto.name) {
      await this.ensureNameIsAvailable(dto.name, id)
    }

    const species = await this.repository.update(id, dto)

    return speciesMapper(species)
  }

  public async delete(id: string): Promise<SpeciesResponseDTO> {
    await this.getById(id)

    const species = await this.repository.delete(id, new Date())

    return speciesMapper(species)
  }

  private async ensureCodeIsAvailable(code: CreateSpeciesDTO['code'], currentId?: string): Promise<void> {
    const existingSpecies = await this.repository.findByCode(code)

    if (existingSpecies && existingSpecies.id !== currentId) {
      throw new AppError('Species code already exists', HttpStatus.CONFLICT)
    }
  }

  private async ensureNameIsAvailable(name: string, currentId?: string): Promise<void> {
    const existingSpecies = await this.repository.findByName(name)

    if (existingSpecies && existingSpecies.id !== currentId) {
      throw new AppError('Species name already exists', HttpStatus.CONFLICT)
    }
  }
}
