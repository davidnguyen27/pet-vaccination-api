import type { RoleCode, employment_status, employment_type } from 'generated/prisma/enums'

export interface I_StaffProfileUser {
  id: string
  email: string
  role: RoleCode
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
}

export interface I_StaffProfile {
  id: string
  user_id: string
  code: string
  job_title: string | null
  department: string | null
  employment_type: employment_type
  employment_status: employment_status
  join_date: Date
  end_date: Date | null
  address: string
  citizen_id: string
  notes: string | null
  created_at: Date
  updated_at: Date
  user: I_StaffProfileUser
}
