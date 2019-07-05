const BaseConfig = require('../core/BaseConfig')

class AppConfig extends BaseConfig {
  constructor () {
    super()
    this.port = this.set(this.getEnv('APP_PORT', 5555), this.joi.number().port().required())
    this.host = this.set(this.getEnv('APP_HOST', 'localhost'), this.joi.string().required())
    this.name = this.set(this.getEnv('APP_NAME', 'SupraAPI'), this.joi.string().required())
  }
}

module.exports = new AppConfig()
