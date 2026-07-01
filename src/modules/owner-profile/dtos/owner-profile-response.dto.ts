import type { RoleCode } from 'generated/prisma/enums'

export interface OwnerProfileUserResponseDTO {
  id: string
  email: string
  role: RoleCode
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
}

export interface OwnerProfileResponseDTO {
  id: string
  user_id: string
  address: string | null
  location_lat: number | null
  location_lng: number | null
  total_points: number
  created_at: string
  updated_at: string
  user: OwnerProfileUserResponseDTO
}

export interface OwnerProfileListResponseDTO {
  data: OwnerProfileResponseDTO[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
