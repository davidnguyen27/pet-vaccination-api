import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'

import { env } from '~/core/env'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

interface CloudinaryUploadResult {
  publicId: string
  secureUrl: string
}

export function uploadImageBuffer(params: {
  buffer: Buffer
  folder: string
  resourceType?: 'image'
}): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: params.folder,
        resource_type: params.resourceType ?? 'image'
      },
      (error, result?: UploadApiResponse) => {
        if (error) {
          reject(error)
          return
        }

        if (!result) {
          reject(new Error('Cloudinary upload failed'))
          return
        }

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url
        })
      }
    )

    uploadStream.end(params.buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}
