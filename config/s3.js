const { BaseConfig } = require('supra-core')
const logger = require('../logger')

class S3Config extends BaseConfig {
  constructor () {
    super()
    this.access = this.set('S3_ACCESS', this.joi.string().required())
    this.secret = this.set('S3_SECRET', this.joi.string().required())
    this.bucket = this.set('S3_BUCKET', this.joi.string().required())
  }

  async init () {
    logger.debug(`${this.constructor.name}: Initialization finish...`)
  }
}

module.exports = new S3Config()
