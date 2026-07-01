import { z } from 'zod'
import { species_code } from 'generated/prisma/enums'

const speciesIdParamsSchema = z.object({
  id: z.string().uuid()
})

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
})

const speciesBodySchema = z.object({
  code: z.enum(species_code),
  name: z.string().trim().min(1).max(255),
  default_vaccine_plan: z.boolean().optional()
})

export const createSpeciesSchema = z.object({
  body: speciesBodySchema
})

export const searchSpeciesSchema = z.object({
  query: paginationQuerySchema
})

export const updateSpeciesSchema = z.object({
  params: speciesIdParamsSchema,
  body: speciesBodySchema.partial()
})

export const speciesIdParamsRequestSchema = z.object({
  params: speciesIdParamsSchema
})

export type CreateSpeciesInput = z.infer<typeof createSpeciesSchema>['body']
export type SearchSpeciesInput = z.infer<typeof searchSpeciesSchema>['query']
export type UpdateSpeciesInput = z.infer<typeof updateSpeciesSchema>['body']
export type SpeciesIdParamsInput = z.infer<typeof speciesIdParamsRequestSchema>['params']
