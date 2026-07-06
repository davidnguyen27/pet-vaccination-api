import cors from 'cors'
import cookieParser from 'cookie-parser'
import express, { type Request, type Response } from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'

import { setupSwagger } from './core/configs/swagger.config'
import { env } from './core/env'
import type { IRoute } from './core/interfaces'
import { errorMiddleware } from './core/middlewares/error.middleware'

export default class App {
  public app: express.Express
  public port: number
  public production: boolean

  constructor(routes: IRoute[]) {
    this.app = express()
    this.port = env.PORT
    this.production = env.NODE_ENV === 'production'

    this.app.disable('etag')

    this.initializeMiddleware()
    this.initializeSwagger()
    this.initializeRoute(routes)
    this.initializeHealthCheck()
    this.initializeErrorMiddleware()
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.info(`Server is running on port ${this.port}`)
    })
  }

  private initializeMiddleware(): void {
    this.app.use(cors({ origin: true, credentials: true }))
    this.app.use(this.production ? morgan('combined') : morgan('dev'))

    if (this.production) {
      this.app.use(hpp())
      this.app.use(helmet())
    }

    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
  }

  private initializeSwagger(): void {
    setupSwagger(this.app)
  }

  private initializeRoute(routes: IRoute[]): void {
    routes.forEach((route) => {
      this.app.use('/', route.router)
    })
  }

  private initializeHealthCheck(): void {
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        data: { status: 'ok' }
      })
    })
  }

  private initializeErrorMiddleware(): void {
    this.app.use(errorMiddleware)
  }
}
