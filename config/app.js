const { BaseConfig } = require('supra-core')
const logger = require('../logger')
const pkg = require('../package.json')

class AppConfig extends BaseConfig {
  constructor () {
    super()
    this.nodeEnv = this.set('NODE_ENV', v => ['development', 'production', 'test'].includes(v), 'development')
    this.port = this.set('APP_PORT', this.joi.number().port().required(), 5555)
    this.host = this.set('APP_HOST', this.joi.string().required(), 'localhost')
    this.name = this.setDirect(pkg.name, this.joi.string().required(), 'supra-api')
    this.url = this.set('APP_URL', this.joi.string().required())
    this.sentryDsn = this.set('SENTRY_DSN', this.joi.string().required())
    this.cookieSecret = this.set('COOKIE_SECRET', this.joi.string().min(10))
  }

  async init () {
    await this.fetchAndSetAsyncValue()
    logger.debug(`${this.constructor.name}: Initialization finish...`)
  }

  fetchAndSetAsyncValue () { // just tor example
    return new Promise(resolve => {
      setTimeout(() => {
        this.testAsyncValue = this.setDirect('some async value', this.joi.string().required(), 'async value')
        this.testDefaultAsyncValue = this.setDirect(undefined, this.joi.string().required(), 'default async value')
        resolve()
      }, 100)
    })
  }
}

module.exports = new AppConfig()
