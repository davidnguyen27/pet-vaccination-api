import { prisma } from '~/core/db/prisma'
import type { RoleCode, employment_status, employment_type } from 'generated/prisma/enums'

import type { I_StaffProfile } from './staff-profile.type'

const staffProfileSelect = {
  id: true,
  user_id: true,
  code: true,
  job_title: true,
  department: true,
  employment_type: true,
  employment_status: true,
  join_date: true,
  end_date: true,
  address: true,
  citizen_id: true,
  notes: true,
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

type CreateStaffProfileData = {
  user_id: string
  code: string
  job_title?: string | null
  department?: string | null
  employment_type: employment_type
  employment_status: employment_status
  join_date: Date
  end_date?: Date | null
  address: string
  citizen_id: string
  notes?: string | null
}

type UpdateStaffProfileData = Partial<Omit<CreateStaffProfileData, 'user_id'>>

type StaffProfileDependencyCounts = {
  appointments: number
}

export default class StaffProfileRepository {
  public async findMany(params: { skip: number; take: number }): Promise<I_StaffProfile[]> {
    return await prisma.staff.findMany({
      select: staffProfileSelect,
      orderBy: { created_at: 'desc' },
      skip: params.skip,
      take: params.take
    })
  }

  public async count(): Promise<number> {
    return await prisma.staff.count()
  }

  public async findById(id: string): Promise<I_StaffProfile | null> {
    return await prisma.staff.findUnique({
      where: { id },
      select: staffProfileSelect
    })
  }

  public async findByUserId(userId: string): Promise<I_StaffProfile | null> {
    return await prisma.staff.findUnique({
      where: { user_id: userId },
      select: staffProfileSelect
    })
  }

  public async findByCode(code: string): Promise<{ id: string } | null> {
    return await prisma.staff.findUnique({
      where: { code },
      select: { id: true }
    })
  }

  public async findByCitizenId(citizenId: string): Promise<{ id: string } | null> {
    return await prisma.staff.findUnique({
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

  public async create(data: CreateStaffProfileData): Promise<I_StaffProfile> {
    return await prisma.staff.create({
      data,
      select: staffProfileSelect
    })
  }

  public async update(id: string, data: UpdateStaffProfileData): Promise<I_StaffProfile> {
    return await prisma.staff.update({
      where: { id },
      data,
      select: staffProfileSelect
    })
  }

  public async delete(id: string): Promise<I_StaffProfile> {
    return await prisma.staff.delete({
      where: { id },
      select: staffProfileSelect
    })
  }

  public async countDependencies(id: string): Promise<StaffProfileDependencyCounts> {
    const appointments = await prisma.appointment.count({ where: { staff_id: id } })

    return {
      appointments
    }
  }
}
