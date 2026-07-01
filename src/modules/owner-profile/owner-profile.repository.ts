import { prisma } from '~/core/db/prisma'
import type { RoleCode } from 'generated/prisma/enums'

import type { I_OwnerProfile } from './owner-profile.type'

const ownerProfileSelect = {
  id: true,
  user_id: true,
  address: true,
  location_lat: true,
  location_lng: true,
  total_points: true,
  created_at: true,
  updated_at: true,
  user: {
    select: {
      id: true,
      email: true,
      role: true,
      full_name: true,
      phone_number: true,
      avatar_url: true
    }
  }
} as const

type CreateOwnerProfileData = {
  user_id: string
  address?: string | null
  location_lat?: number | null
  location_lng?: number | null
}

type UpdateOwnerProfileData = Omit<Partial<CreateOwnerProfileData>, 'user_id'>

type OwnerProfileDependencyCounts = {
  pets: number
  appointments: number
  invoices: number
  payments: number
  ownerVouchers: number
  loyaltyPoints: number
}

export default class OwnerProfileRepository {
  public async findMany(params: { skip: number; take: number }): Promise<I_OwnerProfile[]> {
    return await prisma.owner.findMany({
      select: ownerProfileSelect,
      orderBy: { created_at: 'desc' },
      skip: params.skip,
      take: params.take
    })
  }

  public async count(): Promise<number> {
    return await prisma.owner.count()
  }

  public async findById(id: string): Promise<I_OwnerProfile | null> {
    return await prisma.owner.findUnique({
      where: { id },
      select: ownerProfileSelect
    })
  }

  public async findByUserId(userId: string): Promise<I_OwnerProfile | null> {
    return await prisma.owner.findUnique({
      where: { user_id: userId },
      select: ownerProfileSelect
    })
  }

  public async findUserById(userId: string): Promise<{ id: string; role: RoleCode; is_deleted: boolean } | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        is_deleted: true
      }
    })
  }

  public async create(data: CreateOwnerProfileData): Promise<I_OwnerProfile> {
    return await prisma.owner.create({
      data,
      select: ownerProfileSelect
    })
  }

  public async update(id: string, data: UpdateOwnerProfileData): Promise<I_OwnerProfile> {
    return await prisma.owner.update({
      where: { id },
      data,
      select: ownerProfileSelect
    })
  }

  public async delete(id: string): Promise<I_OwnerProfile> {
    return await prisma.owner.delete({
      where: { id },
      select: ownerProfileSelect
    })
  }

  public async countDependencies(id: string): Promise<OwnerProfileDependencyCounts> {
    const [pets, appointments, invoices, payments, ownerVouchers, loyaltyPoints] = await Promise.all([
      prisma.pet.count({ where: { owner_id: id } }),
      prisma.appointment.count({ where: { owner_id: id } }),
      prisma.invoice.count({ where: { owner_id: id } }),
      prisma.payment.count({ where: { owner_id: id } }),
      prisma.ownerVoucher.count({ where: { owner_id: id } }),
      prisma.loyaltyPoint.count({ where: { owner_id: id } })
    ])

    return {
      pets,
      appointments,
      invoices,
      payments,
      ownerVouchers,
      loyaltyPoints
    }
  }
}
