import type { StaffProfileResponseDTO } from './dtos/staff-profile-response.dto'
import type { I_StaffProfile } from './staff-profile.type'

export function staffProfileMapper(staffProfile: I_StaffProfile): StaffProfileResponseDTO {
  return {
    id: staffProfile.id,
    user_id: staffProfile.user_id,
    code: staffProfile.code,
    job_title: staffProfile.job_title,
    department: staffProfile.department,
    employment_type: staffProfile.employment_type,
    employment_status: staffProfile.employment_status,
    join_date: staffProfile.join_date.toISOString(),
    end_date: staffProfile.end_date?.toISOString() ?? null,
    address: staffProfile.address,
    citizen_id: staffProfile.citizen_id,
    notes: staffProfile.notes,
    created_at: staffProfile.created_at.toISOString(),
    updated_at: staffProfile.updated_at.toISOString(),
    user: {
      id: staffProfile.user.id,
      email: staffProfile.user.email,
      role: staffProfile.user.role,
      full_name: staffProfile.user.full_name,
      phone_number: staffProfile.user.phone_number,
      avatar_url: staffProfile.user.avatar_url
    }
  }
}
