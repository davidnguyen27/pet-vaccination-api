import type { RoleCode } from 'generated/prisma/enums'

export interface I_OwnerProfileUser {
  id: string
  email: string
  role: RoleCode
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
}

export interface I_OwnerProfile {
  id: string
  user_id: string
  address: string | null
  location_lat: number | null
  location_lng: number | null
  total_points: number
  created_at: Date
  updated_at: Date
  user: I_OwnerProfileUser
}
