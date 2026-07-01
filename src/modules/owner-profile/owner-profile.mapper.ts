import type { OwnerProfileResponseDTO } from './dtos/owner-profile-response.dto'
import type { I_OwnerProfile } from './owner-profile.type'

export function ownerProfileMapper(ownerProfile: I_OwnerProfile): OwnerProfileResponseDTO {
  return {
    id: ownerProfile.id,
    user_id: ownerProfile.user_id,
    address: ownerProfile.address,
    location_lat: ownerProfile.location_lat,
    location_lng: ownerProfile.location_lng,
    total_points: ownerProfile.total_points,
    created_at: ownerProfile.created_at.toISOString(),
    updated_at: ownerProfile.updated_at.toISOString(),
    user: {
      id: ownerProfile.user.id,
      email: ownerProfile.user.email,
      role: ownerProfile.user.role,
      full_name: ownerProfile.user.full_name,
      phone_number: ownerProfile.user.phone_number,
      avatar_url: ownerProfile.user.avatar_url
    }
  }
}
