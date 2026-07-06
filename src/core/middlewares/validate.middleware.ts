import type { NextFunction, Request, Response } from 'express'
import { type ClassConstructor, plainToInstance } from 'class-transformer'
import { validate, type ValidationError } from 'class-validator'

import { HttpStatus } from '../enums/http-status'
import { HttpException } from '../exceptions'

type RequestSource = 'body' | 'params' | 'query'

type ValidationErrorResponse = {
  formErrors: string[]
  fieldErrors: Record<string, string[]>
}

const validationOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: false
} as const

export function validateBody<T extends object>(dtoClass: ClassConstructor<T>) {
  return validateSource(dtoClass, 'body')
}

export function validateQuery<T extends object>(dtoClass: ClassConstructor<T>) {
  return validateSource(dtoClass, 'query')
}

export function validateParams<T extends object>(dtoClass: ClassConstructor<T>) {
  return validateSource(dtoClass, 'params')
}

function validateSource<T extends object>(dtoClass: ClassConstructor<T>, source: RequestSource) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToInstance(dtoClass, req[source] ?? {})
    const errors = await validate(dto, validationOptions)

    if (errors.length > 0) {
      next(new HttpException(HttpStatus.BAD_REQUEST, 'Validation failed', formatValidationErrors(errors)))
      return
    }

    req[source] = dto as Request[typeof source]
    req.validated = {
      ...req.validated,
      [source]: dto
    }

    next()
  }
}

function formatValidationErrors(errors: ValidationError[]): ValidationErrorResponse {
  const fieldErrors: Record<string, string[]> = {}

  collectValidationErrors(errors, fieldErrors)

  return { formErrors: [], fieldErrors }
}

function collectValidationErrors(
  errors: ValidationError[],
  fieldErrors: Record<string, string[]>,
  parentPath = ''
): void {
  for (const error of errors) {
    const path = parentPath ? `${parentPath}.${error.property}` : error.property

    if (error.constraints) {
      fieldErrors[path] = Object.values(error.constraints)
    }

    if (error.children && error.children.length > 0) {
      collectValidationErrors(error.children, fieldErrors, path)
    }
  }
}
