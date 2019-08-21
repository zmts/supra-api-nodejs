const { BaseConfig } = require('supra-core')

class EmailConfig extends BaseConfig {
  constructor () {
    super()
    this.mailgunApiKey = this.set('MAILGUN_API_KEY', v => v.includes('key-'))
    this.mailgunDomain = this.set('MAILGUN_DOMAIN', this.joi.string().min(30).max(100).required())
    this.from = this.set('EMAIL_FROM', this.joi.string().min(10).max(100).required())
  }
}

module.exports = new EmailConfig()
