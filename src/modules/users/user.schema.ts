import { z } from 'zod'
import { RoleCode, employment_status, employment_type } from 'generated/prisma/enums'

const booleanFromFormDataSchema = z.preprocess((value) => {
  if (typeof value !== 'string') return value

  if (value === 'true') return true
  if (value === 'false') return false

  return value
}, z.boolean())

const userIdParamsSchema = z.object({
  id: z.string().uuid()
})

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
})

const ownerProfileSchema = z.object({
  address: z.string().trim().min(1).max(255).optional(),
  location_lat: z.coerce.number().optional(),
  location_lng: z.coerce.number().optional()
})

const staffProfileSchema = z.object({
  code: z.string().trim().min(1).max(30),
  job_title: z.string().trim().min(1).max(100).optional(),
  department: z.string().trim().min(1).max(100).optional(),
  employment_type: z.enum(employment_type),
  employment_status: z.enum(employment_status),
  join_date: z.coerce.date(),
  end_date: z.coerce.date().optional(),
  address: z.string().trim().min(1).max(255),
  citizen_id: z.string().trim().min(1).max(30),
  notes: z.string().trim().min(1).max(255).optional()
})

const vetProfileSchema = z.object({
  bio: z.string().trim().min(1).max(255),
  license_no: z.string().trim().min(1).max(50),
  license_issue_by: z.string().trim().min(1).max(255),
  license_valid_from: z.coerce.date(),
  license_valid_to: z.coerce.date(),
  join_date: z.coerce.date(),
  end_date: z.coerce.date().optional(),
  address: z.string().trim().min(1).max(255),
  citizen_id: z.string().trim().min(1).max(30),
  employment_status: z.enum(employment_status)
})

const userAccountBodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(RoleCode).optional(),
  full_name: z.string().trim().min(1).max(255).optional(),
  phone_number: z.string().trim().min(1).max(20).optional(),
  avatar_url: z.string().trim().url().max(255).optional(),
  dob: z.coerce.date().optional(),
  is_active: booleanFromFormDataSchema.optional()
})

const createUserBodySchema = userAccountBodySchema
  .extend({
    owner: ownerProfileSchema.optional(),
    staff: staffProfileSchema.optional(),
    vet: vetProfileSchema.optional()
  })
  .superRefine((data, ctx) => {
    const role = data.role ?? RoleCode.OWNER

    if (role === RoleCode.STAFF && !data.staff) {
      ctx.addIssue({
        code: 'custom',
        path: ['staff'],
        message: 'Staff profile is required when role is STAFF'
      })
    }

    if (role === RoleCode.VET && !data.vet) {
      ctx.addIssue({
        code: 'custom',
        path: ['vet'],
        message: 'Vet profile is required when role is VET'
      })
    }
  })

export const createUserSchema = z.object({
  body: createUserBodySchema
})

export const searchUsersSchema = z.object({
  query: paginationQuerySchema
})

export const updateUserSchema = z.object({
  params: userIdParamsSchema,
  body: userAccountBodySchema.partial()
})

export const userIdParamsRequestSchema = z.object({
  params: userIdParamsSchema
})

export type CreateUserInput = z.infer<typeof createUserSchema>['body']
export type SearchUserInput = z.infer<typeof searchUsersSchema>['query']
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body']
export type UserIdParamsInput = z.infer<typeof userIdParamsRequestSchema>['params']
