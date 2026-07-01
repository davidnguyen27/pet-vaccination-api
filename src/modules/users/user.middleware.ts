import type { NextFunction, Request, Response } from 'express'

import { HttpStatus } from '~/core/enums/http-status'
import { AppError } from '~/core/errors'

const JSON_PROFILE_FIELDS = ['owner', 'staff', 'vet'] as const

export function parseCreateUserFormData(req: Request, _res: Response, next: NextFunction): void {
  try {
    for (const field of JSON_PROFILE_FIELDS) {
      const value = req.body[field]

      if (typeof value === 'string' && value.trim().length > 0) {
        req.body[field] = JSON.parse(value)
      }
    }

    next()
  } catch {
    next(new AppError('Invalid profile JSON in multipart form data', HttpStatus.BAD_REQUEST))
  }
}
