import { BaseModule } from '~/core/modules'

import SpeciesController from './species.controller'
import SpeciesRepository from './species.repository'
import SpeciesRoute from './species.route'
import SpeciesService from './species.service'

export class SpeciesModule extends BaseModule<SpeciesRoute> {
  constructor() {
    super()

    const repository = new SpeciesRepository()
    const service = new SpeciesService(repository)
    const controller = new SpeciesController(service)

    this.route = new SpeciesRoute(controller)
  }
}
