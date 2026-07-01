import type { NextFunction, Request, Response } from 'express'

import { AppError } from '../errors'

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  void _next

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors
    })
    return
  }

  const message = error instanceof Error ? error.message : 'Internal server error'

  res.status(500).json({
    success: false,
    message
  })
}
