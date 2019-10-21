require('dotenv').config()
require('./globals')()

const { Model } = require('objection')
const Knex = require('knex')

const { Server, assert } = require('supra-core')
const controllers = require('./controllers')
const config = require('./config')
const middlewares = require('./middlewares')
const errorMiddleware = require('./middlewares/errorMiddleware')
const logger = require('./logger')

new Server({
  port: Number(config.app.port),
  host: config.app.host,
  controllers,
  middlewares,
  errorMiddleware,
  logger
}).then(serverParams => {
  logger.trace('Server initialized...', serverParams)
  logger.trace('--- Configs ---')
  logger.trace('App config:', config.app)
  logger.trace('Refresh token:', config.token.refresh)
  logger.trace('Access token:', config.token.access.toString())
  logger.trace('Reset password token:', config.token.resetPassword.toString())
  logger.trace('Email confirm token:', config.token.emailConfirm.toString())
  logger.trace('Tokens iss:', config.token.jwtIss)
}).catch(error => logger.error('Server fails to initialize...', error))
  .then(() => Model.knex(Knex(config.knex)))
  .then(() => testDbConnection(Knex(config.knex)))
  .then(() => {
    logger.trace('--- Database ---')
    logger.trace('Database initialized...', config.knex)
  }).catch(error => {
    logger.error('Database fails to initialize...', error)
    process.exit(1)
  })

async function testDbConnection (knexInstance) {
  assert.func(knexInstance, { required: true })
  assert.func(knexInstance.raw, { required: true })

  try {
    await knexInstance.raw('select 1+1 as result')
  } catch (e) {
    throw e
  } finally {
    knexInstance.destroy()
  }
}
