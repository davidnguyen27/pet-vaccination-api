import multer from 'multer'
import type { RequestHandler } from 'express'

import { HttpStatus } from '~/core/enums/http-status'
import { AppError } from '~/core/errors'

import { MAX_IMAGE_SIZE_IN_BYTES } from '../constants/common.constant'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE_IN_BYTES
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new AppError('Avatar must be an image file', HttpStatus.BAD_REQUEST))
      return
    }

    callback(null, true)
  }
}).single('avatar')

export const uploadUserAvatar: RequestHandler = (req, res, next) => {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      next(new AppError('Avatar file size must not exceed 5MB', HttpStatus.BAD_REQUEST))
      return
    }

    if (error instanceof multer.MulterError) {
      next(new AppError(error.message, HttpStatus.BAD_REQUEST))
      return
    }

    next(error)
  })
}
