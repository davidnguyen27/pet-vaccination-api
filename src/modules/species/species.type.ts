import type { species_code } from 'generated/prisma/enums'

export interface I_Species {
  id: string
  code: species_code
  name: string
  default_vaccine_plan: boolean
  is_deleted: boolean
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}
