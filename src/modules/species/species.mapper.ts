import type { SpeciesResponseDTO } from './dtos/species-response.dto'
import type { I_Species } from './species.type'

export function speciesMapper(species: I_Species): SpeciesResponseDTO {
  return {
    id: species.id,
    code: species.code,
    name: species.name,
    default_vaccine_plan: species.default_vaccine_plan,
    is_deleted: species.is_deleted,
    created_at: species.created_at.toISOString(),
    updated_at: species.updated_at.toISOString(),
    deleted_at: species.deleted_at?.toISOString() ?? null
  }
}
