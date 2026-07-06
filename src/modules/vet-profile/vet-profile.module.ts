import { BaseModule } from '~/core/modules'

import VetProfileController from './vet-profile.controller'
import VetProfileRepository from './vet-profile.repository'
import VetProfileRoute from './vet-profile.route'
import VetProfileService from './vet-profile.service'

export class VetProfileModule extends BaseModule<VetProfileRoute> {
  constructor() {
    super()

    const repository = new VetProfileRepository()
    const service = new VetProfileService(repository)
    const controller = new VetProfileController(service)

    this.route = new VetProfileRoute(controller)
  }
}
