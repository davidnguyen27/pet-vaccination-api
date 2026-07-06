import { BaseModule } from '~/core/modules'

import UserController from './user.controller'
import UserRepository from './user.repository'
import UserRoute from './user.route'
import UserService from './user.service'

export class UserModule extends BaseModule<UserRoute> {
  constructor() {
    super()

    const repository = new UserRepository()
    const service = new UserService(repository)
    const controller = new UserController(service)

    this.route = new UserRoute(controller)
  }
}
