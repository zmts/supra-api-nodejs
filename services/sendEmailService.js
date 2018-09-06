/**
 * https://documentation.mailgun.com/en/latest/api-sending.html#examples
 */

const config = require('../config')
const mailgun = require('mailgun-js')({ apiKey: config.email.mailgunApiKey, domain: config.email.mailgunDomain })

/*
 * Example:
 * from: 'Title <hello@super.com>'
 * to: 'best_user@mail.com'
 * subject: 'Hello',
 * text: 'Testing some Mailgun awesomness!'
 */
module.exports = letter => {
  __typecheck(letter, 'Object', true)
  __typecheck(letter.from, 'String')
  __typecheck(letter.to, 'String', true)
  __typecheck(letter.subject, 'String', true)
  __typecheck(letter.text, 'String', true)

  const data = {
    from: letter.from || config.email.from,
    to: letter.to || config.email.to,
    subject: letter.subject || 'Hello',
    text: letter.text || 'Testing some Mailgun awesomness!'
  }

  return Promise.resolve(mailgun.messages().send(data, (error, response) => {
    console.log(error)
    // logger(error)
    // logger(response)
    // TODO WARNING HIGH PRIORITY FIX
  }))
}
