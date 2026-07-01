import type { species_code } from 'generated/prisma/enums'

export interface SpeciesResponseDTO {
  id: string
  code: species_code
  name: string
  default_vaccine_plan: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface SpeciesListResponseDTO {
  data: SpeciesResponseDTO[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
