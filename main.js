require('dotenv').load()
require('./globals')()

const Server = require('./core/Server')
const routers = require('./routers')
const config = require('./config')
const middlewares = require('./middlewares')
const errorMiddleware = require('./middlewares/errorMiddleware')

new Server({
  port: config.app.port,
  host: config.app.host,
  routers,
  middlewares,
  errorMiddleware,
  knexConfig: config.knex
}).then(serverParams => {
  __logger.info('Server initialized...', serverParams)
  __logger.info('App config:', config.app)
  __logger.info('DB config:', config.knex)
}).catch(error => __logger.error('Server fails to initialize...', error))
