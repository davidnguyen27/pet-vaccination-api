import 'dotenv/config'
import { cleanEnv, num, str } from 'envalid'

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
  PORT: num({ default: 3000 }),

  DATABASE_URL: str(),

  JWT_ACCESS_SECRET: str(),
  JWT_ACCESS_EXPIRES_IN: str({ default: '1d' }),
  JWT_REFRESH_SECRET: str(),
  JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),

  EMAIL_HOST: str({ default: '' }),
  EMAIL_PORT: num({ default: 0 }),
  EMAIL_USER: str({ default: '' }),
  EMAIL_PASSWORD: str({ default: '' }),

  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  CLOUDINARY_USER_AVATAR_FOLDER: str({ default: 'pvms/user-avatars' })
})
