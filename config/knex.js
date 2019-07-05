const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const BaseConfig = require('../core/BaseConfig')

class KnexConfig extends BaseConfig {
  constructor () {
    super()
    this.client = 'pg'
    this.connection = {
      host: this.set(this.getEnv('DB_HOST'), this.joi.string().min(4).max(100).required()),
      port: this.set(this.getEnv('DB_PORT', '5432'), this.joi.number().required()),
      user: this.set(this.getEnv('DB_USER', 'postgres'), this.joi.string().min(4).max(100).required()),
      password: this.set(this.getEnv('DB_PASSWORD', ''), this.joi.string().allow(['']).required()),
      database: this.set(this.getEnv('DB_NAME'), this.joi.string().min(4).max(100).required()),
      charset: this.set(this.getEnv('DB_CHARSET', 'utf8'), this.joi.valid(['utf8']).required())
    }
    this.pool = {
      min: 1,
      max: 10
    }
    // this.debug: true
  }
}

module.exports = new KnexConfig()
