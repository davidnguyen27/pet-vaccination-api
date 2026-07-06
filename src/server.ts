import 'reflect-metadata'

import App from './app'
import { AuthModule } from './modules/auth'
import { OwnerProfileModule } from './modules/owner-profile'
import { SpeciesModule } from './modules/species'
import { StaffProfileModule } from './modules/staff-profile'
import { UserModule } from './modules/users'
import { VetProfileModule } from './modules/vet-profile'

const authModule = new AuthModule()
const ownerProfileModule = new OwnerProfileModule()
const speciesModule = new SpeciesModule()
const staffProfileModule = new StaffProfileModule()
const userModule = new UserModule()
const vetProfileModule = new VetProfileModule()

const routes = [
  authModule.getRoute(),
  ownerProfileModule.getRoute(),
  speciesModule.getRoute(),
  staffProfileModule.getRoute(),
  userModule.getRoute(),
  vetProfileModule.getRoute()
]

const app = new App(routes)

app.listen()
