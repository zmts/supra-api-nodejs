const BaseConfig = require('../core/BaseConfig')

class EmailConfig extends BaseConfig {
  constructor () {
    super()
    this.mailgunApiKey = this.set(this.getEnv('MAILGUN_API_KEY'), v => v.includes('key-'))
    this.mailgunDomain = this.set(this.getEnv('MAILGUN_DOMAIN'), this.joi.string().min(30).max(100).required())
    this.from = this.set(this.getEnv('EMAIL_FROM'), this.joi.string().min(10).max(100).required())
  }
}

module.exports = new EmailConfig()
