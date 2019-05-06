/**
 * https://documentation.mailgun.com/en/latest/api-sending.html#examples
 */

const $ = Symbol('private scope')
const mailgun = require('mailgun-js')
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class EmailClient {
  constructor (options = {}) {
    __typecheck(options.apiKey, __type.string, true)
    __typecheck(options.domain, __type.string, true)
    __typecheck(options.from, __type.string)

    this[$] = {
      client: mailgun({
        apiKey: options.apiKey,
        domain: options.domain
      }),
      from: options.from || '<no-reply@rawart.io>'
    }

    __logger.info(`${this.constructor.name} constructed...`)
  }

  /**
   * Example:
   * from: 'Title <hello@super.com>'
   * to: 'best_user@mail.com'
   * subject: 'Hello',
   * text: 'Testing some Mailgun awesomness!'
   */
  send (letter) {
    __typecheck(letter, __type.object, true)
    __typecheck(letter.from, __type.string)
    __typecheck(letter.to, __type.string, true)
    __typecheck(letter.subject, __type.string, true)
    __typecheck(letter.text, __type.string, true)
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
        if (error) return reject(error)
        return resolve(response)
      })
    })
  }
}

module.exports = EmailClient
