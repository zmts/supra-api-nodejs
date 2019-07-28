const BaseConfig = require('../core/BaseConfig')

class AppConfig extends BaseConfig {
  constructor () {
    super()
    this.nodeEnv = this.set('NODE_ENV', v => ['development', 'production'].includes(v), 'development')
    this.port = this.set('APP_PORT', this.joi.number().port().required(), 5555)
    this.host = this.set('APP_HOST', this.joi.string().required(), 'localhost')
    this.name = this.set('APP_NAME', this.joi.string().required(), 'SupraAPI')
    this.sentryDns = this.set('SENTRY_DNS', this.joi.string().required())
  }
}

module.exports = new AppConfig()
