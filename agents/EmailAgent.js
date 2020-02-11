/**
 * https://documentation.mailgun.com/en/latest/api-sending.html#examples
 */
const mailgun = require('mailgun-js')
const { assert, AbstractLogger, AppError, errorCodes } = require('supra-core')

const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const $ = Symbol('private scope')

class EmailAgent {
  constructor (options = {}) {
    assert.string(options.apiKey, { notEmpty: true })
    assert.string(options.domain, { notEmpty: true })
    assert.string(options.host, { notEmpty: true })
    assert.string(options.from)
    assert.instanceOf(options.logger, AbstractLogger)

    this[$] = {
      client: mailgun({
        apiKey: options.apiKey,
        domain: options.domain
      }),
      from: options.from || '<no-reply@supra.com>',
      logger: options.logger
    }

    this[$].logger.debug(`${this.constructor.name} constructed...`)
  }

  /**
   * Example:
   * from: 'Title <hello@super.com>'
   * to: 'best_user@mail.com'
   * subject: 'Hello',
   * text: 'Testing some Mailgun awesomness!'
   */
  send (letter) {
    assert.object(letter, { required: true })
    assert.string(letter.from)
    assert.string(letter.to, { notEmpty: true })
    assert.string(letter.subject, { notEmpty: true })
    assert.string(letter.text, { notEmpty: true })
    const isValidToEmail = emailRegEx.test(letter.to)
    if (!isValidToEmail) {
      throw new Error('Wrong "to" option. Should be valid email address.')
    }

    const data = {
      from: letter.from || this[$].from,
      to: letter.to,
      subject: letter.subject || 'Hello',
      text: letter.text || 'Testing some Mailgun awesomness!'
    }

    return new Promise((resolve, reject) => {
      this[$].client.messages().send(data, (error, response) => {
        if (error) {
          return reject(new AppError({
            ...errorCodes.EXTERNAL,
            message: `${this.constructor.name}: ${error.message}`,
            origin: error
          }))
        }
        return resolve(response)
      })
    })
  }
}

module.exports = { EmailAgent }
