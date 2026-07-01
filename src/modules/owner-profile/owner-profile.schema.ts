import { z } from 'zod'

const ownerProfileIdParamsSchema = z.object({
  id: z.string().uuid()
})

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
})

const ownerProfileBodySchema = z.object({
  address: z.string().trim().min(1).max(255).nullable().optional(),
  location_lat: z.coerce.number().min(-90).max(90).nullable().optional(),
  location_lng: z.coerce.number().min(-180).max(180).nullable().optional()
})

export const createOwnerProfileSchema = z.object({
  body: ownerProfileBodySchema.extend({
    user_id: z.string().uuid()
  })
})

export const searchOwnerProfilesSchema = z.object({
  query: paginationQuerySchema
})

export const updateOwnerProfileSchema = z.object({
  params: ownerProfileIdParamsSchema,
  body: ownerProfileBodySchema
})

export const ownerProfileIdParamsRequestSchema = z.object({
  params: ownerProfileIdParamsSchema
})

export type CreateOwnerProfileInput = z.infer<typeof createOwnerProfileSchema>['body']
export type SearchOwnerProfileInput = z.infer<typeof searchOwnerProfilesSchema>['query']
export type UpdateOwnerProfileInput = z.infer<typeof updateOwnerProfileSchema>['body']
export type OwnerProfileIdParamsInput = z.infer<typeof ownerProfileIdParamsRequestSchema>['params']
