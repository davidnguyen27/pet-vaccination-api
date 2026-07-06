import type { NextFunction, Request, Response } from 'express'

import { HttpStatus } from '~/core/enums/http-status'
import { HttpException } from '~/core/exceptions'

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
    next(new HttpException(HttpStatus.BAD_REQUEST, 'Invalid profile JSON in multipart form data'))
  }
}
