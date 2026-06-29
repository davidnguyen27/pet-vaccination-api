import { app } from './app.js'
import { env } from './core/env/index.js'

app.listen(env.PORT, () => {
  console.info(`Server is running on port ${env.PORT}`)
})
