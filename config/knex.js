const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const BaseConfig = require('../core/BaseConfig')

class KnexConfig extends BaseConfig {
  constructor () {
    super()
    this.client = 'pg'
    this.connection = {
      host: this.set(this.getEnv('DB_HOST'), this.joi.string().min(4).max(100)),
      port: this.set(this.getEnv('DB_PORT'), this.joi.number()),
      user: this.set(this.getEnv('DB_USER'), this.joi.string().min(4).max(100)),
      password: this.set(this.getEnv('DB_PASSWORD'), this.joi.string().allow([''])),
      database: this.set(this.getEnv('DB_NAME'), this.joi.string().min(4).max(100)),
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
