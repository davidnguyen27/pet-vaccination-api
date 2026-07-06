import type { RoleCode, employment_status } from 'generated/prisma/enums'

export interface VetProfileUserResponseDTO {
  id: string
  email: string
  role: RoleCode
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
}

export interface VetProfileResponseDTO {
  id: string
  user_id: string
  bio: string
  license_no: string
  license_issue_by: string
  license_valid_from: string
  license_valid_to: string
  join_date: string
  end_date: string | null
  address: string
  citizen_id: string
  employment_status: employment_status
  created_at: string
  updated_at: string
  user: VetProfileUserResponseDTO
}

export interface VetProfileListResponseDTO {
  data: VetProfileResponseDTO[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
