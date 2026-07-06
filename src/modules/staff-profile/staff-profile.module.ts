import { BaseModule } from '~/core/modules'

import StaffProfileController from './staff-profile.controller'
import StaffProfileRepository from './staff-profile.repository'
import StaffProfileRoute from './staff-profile.route'
import StaffProfileService from './staff-profile.service'

export class StaffProfileModule extends BaseModule<StaffProfileRoute> {
  constructor() {
    super()

    const repository = new StaffProfileRepository()
    const service = new StaffProfileService(repository)
    const controller = new StaffProfileController(service)

    this.route = new StaffProfileRoute(controller)
  }
}
