import { prisma } from '~/core/db/prisma'
import type { RoleCode, employment_status } from 'generated/prisma/enums'

import type { I_VetProfile } from './vet-profile.type'

const vetProfileSelect = {
  id: true,
  user_id: true,
  bio: true,
  license_no: true,
  license_issue_by: true,
  license_valid_from: true,
  license_valid_to: true,
  join_date: true,
  end_date: true,
  address: true,
  citizen_id: true,
  employment_status: true,
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

type CreateVetProfileData = {
  user_id: string
  bio: string
  license_no: string
  license_issue_by: string
  license_valid_from: Date
  license_valid_to: Date
  join_date: Date
  end_date?: Date | null
  address: string
  citizen_id: string
  employment_status: employment_status
}

type UpdateVetProfileData = Partial<Omit<CreateVetProfileData, 'user_id'>>

type VetProfileDependencyCounts = {
  appointments: number
  microchipRecords: number
  healthCertificateRecords: number
  workingShifts: number
  blockTimes: number
}

export default class VetProfileRepository {
  public async findMany(params: { skip: number; take: number }): Promise<I_VetProfile[]> {
    return await prisma.vet.findMany({
      select: vetProfileSelect,
      orderBy: { created_at: 'desc' },
      skip: params.skip,
      take: params.take
    })
  }

  public async count(): Promise<number> {
    return await prisma.vet.count()
  }

  public async findById(id: string): Promise<I_VetProfile | null> {
    return await prisma.vet.findUnique({
      where: { id },
      select: vetProfileSelect
    })
  }

  public async findByUserId(userId: string): Promise<I_VetProfile | null> {
    return await prisma.vet.findUnique({
      where: { user_id: userId },
      select: vetProfileSelect
    })
  }

  public async findByLicenseNo(licenseNo: string): Promise<{ id: string } | null> {
    return await prisma.vet.findUnique({
      where: { license_no: licenseNo },
      select: { id: true }
    })
  }

  public async findByCitizenId(citizenId: string): Promise<{ id: string } | null> {
    return await prisma.vet.findUnique({
      where: { citizen_id: citizenId },
      select: { id: true }
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

  public async create(data: CreateVetProfileData): Promise<I_VetProfile> {
    return await prisma.vet.create({
      data,
      select: vetProfileSelect
    })
  }

  public async update(id: string, data: UpdateVetProfileData): Promise<I_VetProfile> {
    return await prisma.vet.update({
      where: { id },
      data,
      select: vetProfileSelect
    })
  }

  public async delete(id: string): Promise<I_VetProfile> {
    return await prisma.vet.delete({
      where: { id },
      select: vetProfileSelect
    })
  }

  public async countDependencies(id: string): Promise<VetProfileDependencyCounts> {
    const [appointments, microchipRecords, healthCertificateRecords, workingShifts, blockTimes] = await Promise.all([
      prisma.appointment.count({ where: { vet_id: id } }),
      prisma.microchipRecord.count({ where: { vet_id: id } }),
      prisma.healthCerRecord.count({ where: { vet_id: id } }),
      prisma.workingShift.count({ where: { vet_id: id } }),
      prisma.blockTime.count({ where: { vet_id: id } })
    ])

    return {
      appointments,
      microchipRecords,
      healthCertificateRecords,
      workingShifts,
      blockTimes
    }
  }
}
