const BaseConfig = require('../core/BaseConfig')

class AppConfig extends BaseConfig {
  constructor () {
    super()
    this.port = this.set(process.env.APP_PORT, this.joi.number().port().required())
    this.host = this.set(process.env.APP_HOST, this.joi.string().required())
    this.name = this.set(process.env.APP_NAME, this.joi.string().required())
  }
}

module.exports = new AppConfig()
