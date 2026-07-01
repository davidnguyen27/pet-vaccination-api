import { app } from './app'
import { env } from './core/env/index'

app.listen(env.PORT, () => {
  console.info(`Server is running on port ${env.PORT}`)
})
