import type { RoleCode, employment_status } from 'generated/prisma/enums'

export interface I_VetProfileUser {
  id: string
  email: string
  role: RoleCode
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
}

export interface I_VetProfile {
  id: string
  user_id: string
  bio: string
  license_no: string
  license_issue_by: string
  license_valid_from: Date
  license_valid_to: Date
  join_date: Date
  end_date: Date | null
  address: string
  citizen_id: string
  employment_status: employment_status
  created_at: Date
  updated_at: Date
  user: I_VetProfileUser
}
