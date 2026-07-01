import cors from 'cors'
import cookieParser from 'cookie-parser'
import express, { type Request, type Response } from 'express'

import { errorMiddleware } from './core/middlewares/error.middleware'
import AuthRoute from './modules/auth/auth.route'
import UserRoute from './modules/users/user.route'

export const app = express()
const authRoute = new AuthRoute()
const userRoute = new UserRoute()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    data: { status: 'ok' }
  })
})

app.use('/auth', authRoute.router)
app.use('/users', userRoute.router)

app.use(errorMiddleware)
