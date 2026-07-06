import { BaseModule } from '~/core/modules'

import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import AuthRoute from './auth.route'
import AuthService from './auth.service'

export class AuthModule extends BaseModule<AuthRoute> {
  constructor() {
    super()

    const repository = new AuthRepository()
    const service = new AuthService(repository)
    const controller = new AuthController(service)

    this.route = new AuthRoute(controller)
  }
}
