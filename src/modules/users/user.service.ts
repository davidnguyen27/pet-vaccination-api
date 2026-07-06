import bcrypt from 'bcryptjs'

import { HttpException } from '~/core/exceptions'
import { HttpStatus } from '~/core/enums/http-status'
import { PASSWORD_SALT_ROUNDS } from '~/core/constants/user.constant'
import { env } from '~/core/env'
import { uploadImageBuffer } from '~/core/configs/cloudinary.config'

import type {
  CreateUserDTO,
  SearchUserDTO,
  UpdateUserDTO,
  UserAvatarUploadDTO,
  UserListResponseDTO,
  UserResponseDTO
} from './user.dto'
import UserRepository from './user.repository'
import { userMapper } from './user.mapper'

export default class UserService {
  constructor(private readonly repository: UserRepository) {}

  public async getAll(query: SearchUserDTO): Promise<UserListResponseDTO> {
    const skip = (query.page - 1) * query.limit
    const [users, total] = await Promise.all([
      this.repository.findMany({ skip, take: query.limit }),
      this.repository.count()
    ])

    return {
      data: users.map(userMapper),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit)
      }
    }
  }

  public async getById(id: string): Promise<UserResponseDTO> {
    const user = await this.repository.findById(id)

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found')
    }

    return userMapper(user)
  }

  public async create(dto: CreateUserDTO, avatarFile?: UserAvatarUploadDTO): Promise<UserResponseDTO> {
    const existingUser = await this.repository.findByEmail(dto.email)

    if (existingUser) {
      throw new HttpException(HttpStatus.CONFLICT, 'Email already exists')
    }

    const avatarUpload = avatarFile
      ? await uploadImageBuffer({
          buffer: avatarFile.buffer,
          folder: env.CLOUDINARY_USER_AVATAR_FOLDER
        })
      : undefined

    const password = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS)
    const user = await this.repository.create({
      ...dto,
      avatar_url: avatarUpload?.secureUrl ?? dto.avatar_url,
      is_active: true,
      password
    })

    return userMapper(user)
  }

  public async update(id: string, dto: UpdateUserDTO, avatarFile?: UserAvatarUploadDTO): Promise<UserResponseDTO> {
    await this.getById(id)

    if (Object.keys(dto).length === 0 && !avatarFile) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'At least one field is required')
    }

    if (dto.email) {
      const existingUser = await this.repository.findByEmail(dto.email)

      if (existingUser && existingUser.id !== id) {
        throw new HttpException(HttpStatus.CONFLICT, 'Email already exists')
      }
    }

    const avatarUpload = avatarFile
      ? await uploadImageBuffer({
          buffer: avatarFile.buffer,
          folder: env.CLOUDINARY_USER_AVATAR_FOLDER
        })
      : undefined
    const password = dto.password ? await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS) : undefined
    const user = await this.repository.update(id, {
      ...dto,
      avatar_url: avatarUpload?.secureUrl ?? dto.avatar_url,
      password
    })

    return userMapper(user)
  }

  public async delete(id: string): Promise<UserResponseDTO> {
    await this.getById(id)

    const user = await this.repository.delete(id, new Date())

    return userMapper(user)
  }
}
