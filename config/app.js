const BaseConfig = require('../core/BaseConfig')

class AppConfig extends BaseConfig {
  constructor () {
    super()
    this.port = this.set(process.env.APP_PORT, this.joi.number().port())
    this.host = this.set(process.env.APP_HOST, this.joi.string())
    this.name = this.set(process.env.APP_NAME, this.joi.string())
    this.pageSize = this.set(process.env.PAGE_SIZE, v => [10, 20, 30, 40, 50, 60, 70, 80, 80, 90, 100].includes(Number(v)))
  }
}

module.exports = new AppConfig()
