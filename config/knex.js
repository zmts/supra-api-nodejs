const path = require('path')
require('dotenv').load({ path: path.join(__dirname, '../.env') })

const BaseConfig = require('../core/BaseConfig')

class KnexConfig extends BaseConfig {
  constructor () {
    super()
    this.client = 'pg'
    this.connection = {
      host: this.set(process.env.DB_HOST || 'localhost', this.joi.string().min(4).max(100)),
      port: this.set(process.env.DB_PORT || 5432, this.joi.number()),
      user: this.set(process.env.DB_USER, this.joi.string().min(4).max(100)),
      password: this.set(process.env.DB_PASSWORD || 'testtesttest', this.joi.string().min(10).max(100)),
      database: this.set(process.env.DB_NAME, this.joi.string().min(4).max(100)),
      charset: this.set(process.env.DB_CHARSET || 'utf8', this.joi.valid(['utf8']))
    }
    this.pool = {
      min: 1,
      max: 10
    }
    // this.debug: true
  }
}

module.exports = new KnexConfig()
