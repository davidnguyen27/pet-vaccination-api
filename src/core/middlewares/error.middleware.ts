import type { NextFunction, Request, Response } from 'express'

import { HttpStatus } from '../enums/http-status'
import { HttpException } from '../exceptions'

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  void _next

  if (error instanceof HttpException) {
    res.status(error.status).json({
      success: false,
      message: error.message,
      errors: error.errors
    })
    return
  }

  const message = error instanceof Error ? error.message : 'Internal server error'

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message,
    errors: undefined
  })
}
