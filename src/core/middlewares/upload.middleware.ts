import multer from 'multer'
import type { RequestHandler } from 'express'

import { HttpStatus } from '~/core/enums/http-status'
import { HttpException } from '~/core/exceptions'

import { MAX_IMAGE_SIZE_IN_BYTES } from '../constants/common.constant'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE_IN_BYTES
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new HttpException(HttpStatus.BAD_REQUEST, 'Avatar must be an image file'))
      return
    }

    callback(null, true)
  }
}).single('avatar')

export const uploadUserAvatar: RequestHandler = (req, res, next) => {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      next(new HttpException(HttpStatus.BAD_REQUEST, 'Avatar file size must not exceed 5MB'))
      return
    }

    if (error instanceof multer.MulterError) {
      next(new HttpException(HttpStatus.BAD_REQUEST, error.message))
      return
    }

    next(error)
  })
}
