import type { RoleCode, employment_status, employment_type } from 'generated/prisma/enums'

export interface StaffProfileUserResponseDTO {
  id: string
  email: string
  role: RoleCode
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
}

export interface StaffProfileResponseDTO {
  id: string
  user_id: string
  code: string
  job_title: string | null
  department: string | null
  employment_type: employment_type
  employment_status: employment_status
  join_date: string
  end_date: string | null
  address: string
  citizen_id: string
  notes: string | null
  created_at: string
  updated_at: string
  user: StaffProfileUserResponseDTO
}

export interface StaffProfileListResponseDTO {
  data: StaffProfileResponseDTO[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
