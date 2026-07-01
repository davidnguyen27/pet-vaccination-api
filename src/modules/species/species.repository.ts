import { prisma } from '~/core/db/prisma'
import type { species_code } from 'generated/prisma/enums'

import type { I_Species } from './species.type'

type CreateSpeciesData = {
  code: species_code
  name: string
  default_vaccine_plan?: boolean
}

type UpdateSpeciesData = Partial<CreateSpeciesData>

export default class SpeciesRepository {
  public async findMany(params: { skip: number; take: number }): Promise<I_Species[]> {
    return await prisma.species.findMany({
      where: { is_deleted: false },
      orderBy: { created_at: 'desc' },
      skip: params.skip,
      take: params.take
    })
  }

  public async count(): Promise<number> {
    return await prisma.species.count({
      where: { is_deleted: false }
    })
  }

  public async findById(id: string): Promise<I_Species | null> {
    return await prisma.species.findFirst({
      where: {
        id,
        is_deleted: false
      }
    })
  }

  public async findByCode(code: species_code): Promise<{ id: string } | null> {
    return await prisma.species.findUnique({
      where: { code },
      select: { id: true }
    })
  }

  public async findByName(name: string): Promise<{ id: string } | null> {
    return await prisma.species.findUnique({
      where: { name },
      select: { id: true }
    })
  }

  public async create(data: CreateSpeciesData): Promise<I_Species> {
    return await prisma.species.create({ data })
  }

  public async update(id: string, data: UpdateSpeciesData): Promise<I_Species> {
    return await prisma.species.update({
      where: { id },
      data
    })
  }

  public async delete(id: string, deletedAt: Date): Promise<I_Species> {
    return await prisma.species.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: deletedAt
      }
    })
  }
}
