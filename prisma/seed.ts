import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

import { RoleCode } from '../generated/prisma/enums.js'
import { PrismaClient } from '../generated/prisma/client.js'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@petclinic.vn'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin@123'
const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME ?? 'System Administrator'
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? 12)

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required')
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl })
})

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_ROUNDS)

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: RoleCode.ADMIN,
      full_name: ADMIN_FULL_NAME,
      password: passwordHash,
      is_active: true,
      is_deleted: false,
      deleted_at: null
    },
    create: {
      role: RoleCode.ADMIN,
      email: ADMIN_EMAIL,
      password: passwordHash,
      full_name: ADMIN_FULL_NAME,
      is_active: true,
      is_deleted: false
    },
    select: {
      id: true,
      email: true,
      role: true,
      full_name: true,
      is_active: true
    }
  })

  console.info('Admin account is ready:', {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    full_name: admin.full_name,
    is_active: admin.is_active
  })
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
