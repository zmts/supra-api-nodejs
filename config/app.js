const BaseConfig = require('../core/BaseConfig')

class AppConfig extends BaseConfig {
  constructor () {
    super()
    this.port = this.set(process.env.PORT, this.joi.number().port())
    this.pageSize = this.set(process.env.PAGE_SIZE, v => [10, 20, 30, 40, 50, 60, 70, 80, 80, 90, 100].includes(Number(v)))
  }
}

module.exports = new AppConfig()
