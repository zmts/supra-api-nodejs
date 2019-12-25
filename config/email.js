const { BaseConfig } = require('supra-core')
const logger = require('../logger')

class EmailConfig extends BaseConfig {
  constructor () {
    super()
    this.mailgunApiKey = this.set('MAILGUN_API_KEY', v => v.includes('key-'))
    this.mailgunDomain = this.set('MAILGUN_DOMAIN', this.joi.string().min(5).max(100).required())
    this.mailgunHost = this.set('MAILGUN_HOST', this.joi.string().min(5).max(100).required(), 'api.mailgun.net') // or 'api.eu.mailgun.net'
    this.from = this.set('EMAIL_FROM', this.joi.string().min(10).max(100).required())
  }

  async init () {
    logger.debug(`${this.constructor.name}: Initialization finish...`)
  }
}

module.exports = new EmailConfig()
