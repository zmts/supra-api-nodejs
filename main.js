require('dotenv').config()
require('./globals')()

const Server = require('./core/Server')
const controllers = require('./controllers')
const config = require('./config')
const middlewares = require('./middlewares')
const errorMiddleware = require('./middlewares/errorMiddleware')

new Server({
  port: config.app.port,
  host: config.app.host,
  controllers,
  middlewares,
  errorMiddleware,
  knexConfig: config.knex
}).then(serverParams => {
  __logger.info('Server initialized...', serverParams)
  __logger.info('--- Configs ---')
  __logger.info('App config:', config.app)
  __logger.info('DB config:', config.knex)
  __logger.info('Refresh token:', config.token.refresh)
  __logger.info('Access token:', config.token.access.toString())
  __logger.info('Reset password token:', config.token.resetPassword.toString())
  __logger.info('Email confirm token:', config.token.emailConfirm.toString())
  __logger.info('Tokens iss:', config.token.jwtIss)
}).catch(error => __logger.error('Server fails to initialize...', error))
