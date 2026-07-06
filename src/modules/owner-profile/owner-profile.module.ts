import { BaseModule } from '~/core/modules'

import OwnerProfileController from './owner-profile.controller'
import OwnerProfileRepository from './owner-profile.repository'
import OwnerProfileRoute from './owner-profile.route'
import OwnerProfileService from './owner-profile.service'

export class OwnerProfileModule extends BaseModule<OwnerProfileRoute> {
  constructor() {
    super()

    const repository = new OwnerProfileRepository()
    const service = new OwnerProfileService(repository)
    const controller = new OwnerProfileController(service)

    this.route = new OwnerProfileRoute(controller)
  }
}
