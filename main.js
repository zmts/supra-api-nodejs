require('dotenv').config()

const { Model } = require('objection')
const Knex = require('knex')
const stdout = require('stdout-stream')
const chalk = require('chalk')

const { Server, assert } = require('supra-core')
const controllers = require('./controllers')
const config = require('./config')
const middlewares = require('./middlewares')
const errorMiddleware = require('./middlewares/errorMiddleware')
const logger = require('./logger')

config.rootInit().then(() => {
  return new Server({
    port: Number(config.app.port),
    host: config.app.host,
    controllers,
    middlewares,
    errorMiddleware,
    logger
  })
}).then(serverParams => {
  logger.info('Server initialized...', serverParams)
  logger.debug('--- Configs ---')
  logger.debug('App config:', config.app)
  logger.debug('Refresh token:', config.token.refresh)
  logger.debug('Access token:', config.token.access.toString())
  logger.debug('Reset password token:', config.token.resetPassword.toString())
  logger.debug('Email confirm token:', config.token.emailConfirm.toString())
  logger.debug('Tokens iss:', config.token.jwtIss)
}).catch(error => {
  stdout.write(chalk.blue(error.stack))
  logger.error('Server fails to initialize...', error)
})
  .then(() => Model.knex(Knex(config.knex)))
  .then(() => testDbConnection(Knex(config.knex)))
  .then(() => {
    logger.debug('--- Database ---')
    logger.debug('Database initialized...', config.knex)
  }).catch(error => {
    stdout.write(chalk.blue(error.stack))
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
