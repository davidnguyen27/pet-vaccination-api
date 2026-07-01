import { prisma } from '~/core/db/prisma'
import { RoleCode, type employment_status, type employment_type } from 'generated/prisma/enums'
import type { I_User } from './user.type'

type CreateUserData = {
  email: string
  password: string
  role?: RoleCode
  full_name?: string
  phone_number?: string
  avatar_url?: string
  dob?: Date
  is_active?: boolean
  owner?: {
    address?: string
    location_lat?: number
    location_lng?: number
  }
  staff?: {
    code: string
    job_title?: string
    department?: string
    employment_type: employment_type
    employment_status: employment_status
    join_date: Date
    end_date?: Date
    address: string
    citizen_id: string
    notes?: string
  }
  vet?: {
    bio: string
    license_no: string
    license_issue_by: string
    license_valid_from: Date
    license_valid_to: Date
    join_date: Date
    end_date?: Date
    address: string
    citizen_id: string
    employment_status: employment_status
  }
}

export default class UserRepository {
  public async findMany(params: { skip: number; take: number }): Promise<I_User[]> {
    return await prisma.user.findMany({
      where: { is_deleted: false },

      orderBy: { created_at: 'desc' },
      skip: params.skip,
      take: params.take
    })
  }

  public async count(): Promise<number> {
    return await prisma.user.count({
      where: { is_deleted: false }
    })
  }

  public async findById(id: string): Promise<I_User | null> {
    return await prisma.user.findFirst({
      where: {
        id,
        is_deleted: false
      }
    })
  }

  public async findByEmail(email: string): Promise<{ id: string } | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })
  }

  public async create(data: CreateUserData): Promise<I_User> {
    const { owner, staff, vet, ...userData } = data
    const role = userData.role ?? RoleCode.OWNER

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          ...userData,
          role
        }
      })

      if (role === RoleCode.OWNER) {
        await tx.owner.create({
          data: {
            user_id: user.id,
            ...owner
          }
        })
      }

      if (role === RoleCode.STAFF && staff) {
        await tx.staff.create({
          data: {
            ...staff,
            user_id: user.id
          }
        })
      }

      if (role === RoleCode.VET && vet) {
        await tx.vet.create({
          data: {
            ...vet,
            user_id: user.id
          }
        })
      }

      return user
    })
  }

  public async update(
    id: string,
    data: {
      email?: string
      password?: string
      role?: RoleCode
      full_name?: string
      phone_number?: string
      avatar_url?: string
      dob?: Date
      is_active?: boolean
    }
  ): Promise<I_User> {
    return await prisma.user.update({
      where: { id },
      data
    })
  }

  public async delete(id: string, deletedAt: Date): Promise<I_User> {
    return await prisma.user.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: deletedAt,
        is_active: false
      }
    })
  }
}
