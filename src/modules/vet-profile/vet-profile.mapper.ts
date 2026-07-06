import type { VetProfileResponseDTO } from './dtos/vet-profile-response.dto'
import type { I_VetProfile } from './vet-profile.type'

export function vetProfileMapper(vetProfile: I_VetProfile): VetProfileResponseDTO {
  return {
    id: vetProfile.id,
    user_id: vetProfile.user_id,
    bio: vetProfile.bio,
    license_no: vetProfile.license_no,
    license_issue_by: vetProfile.license_issue_by,
    license_valid_from: vetProfile.license_valid_from.toISOString(),
    license_valid_to: vetProfile.license_valid_to.toISOString(),
    join_date: vetProfile.join_date.toISOString(),
    end_date: vetProfile.end_date?.toISOString() ?? null,
    address: vetProfile.address,
    citizen_id: vetProfile.citizen_id,
    employment_status: vetProfile.employment_status,
    created_at: vetProfile.created_at.toISOString(),
    updated_at: vetProfile.updated_at.toISOString(),
    user: {
      id: vetProfile.user.id,
      email: vetProfile.user.email,
      role: vetProfile.user.role,
      full_name: vetProfile.user.full_name,
      phone_number: vetProfile.user.phone_number,
      avatar_url: vetProfile.user.avatar_url
    }
  }
}
