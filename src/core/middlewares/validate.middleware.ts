import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

import { AppError } from '../errors'

export function validateRequest(schema: ZodType<Express.ValidatedRequestData>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    })

    if (!result.success) {
      next(new AppError('Validation failed', 422, result.error.flatten()))
      return
    }

    req.body = result.data.body ?? req.body
    req.params = (result.data.params ?? req.params) as Request['params']
    req.validated = result.data

    next()
  }
}
