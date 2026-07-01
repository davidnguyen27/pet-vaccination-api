import { z } from 'zod'

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(1, 'Password is required')
  })
})

export const verifyTokenSchema = z.object({
  body: z.object({
    token: z.string().trim().min(1, 'Token is required')
  })
})

export const resendVerifyTokenSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
    redirect_url: z.string().trim().url().max(500).optional()
  })
})

export type LoginInput = z.infer<typeof loginSchema>['body']
export type VerifyTokenInput = z.infer<typeof verifyTokenSchema>['body']
export type ResendVerifyTokenInput = z.infer<typeof resendVerifyTokenSchema>['body']
