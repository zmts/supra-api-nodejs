const BaseConfig = require('../core/BaseConfig')

class S3Config extends BaseConfig {
  constructor () {
    super()
    this.access = this.set(this.getEnv('S3_ACCESS'), this.joi.string().required())
    this.secret = this.set(this.getEnv('S3_SECRET'), this.joi.string().required())
    this.bucket = this.set(this.getEnv('S3_BUCKET'), this.joi.string().required())
  }
}

module.exports = new S3Config()
