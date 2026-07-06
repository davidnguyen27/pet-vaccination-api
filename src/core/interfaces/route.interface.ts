import type { Router } from 'express'

export interface IRoute {
  path: string
  router: Router
}
