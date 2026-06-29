import cors from 'cors'
import express, { type Request, type Response } from 'express'

import { errorMiddleware } from './core/middlewares/error.middleware.js'
import { authRouter } from './modules/auth/auth.route.js'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    data: { status: 'ok' }
  })
})

app.use('/auth', authRouter)

app.use(errorMiddleware)
