const { assert } = require('supra-core')

const { UserModel } = require('../../../../models/UserModel')
const { app } = require('../../../../config')

class WelcomeEmail {
  constructor ({ to, username, emailConfirmToken } = {}) {
    assert.object(arguments[0], { required: true })
    assert.validate(to, UserModel.schema.email, { required: true })
    assert.validate(username, UserModel.schema.username, { required: true })
    assert.validate(emailConfirmToken, UserModel.schema.emailConfirmToken, { required: true })

    this.to = to
    this.subject = `[${app.name}] Welcome on board! Confirmation instructions.`
    this.text = `Welcome to ${app.name}!
${username} we just created new account for you. Your login: ${to}

To finish registration process click the link below to confirm your account.
${app.url}/a/confirm-registration?emailConfirmToken=${emailConfirmToken}

Looking forward to working with you!

Cheers,
The ${app.name} Team`
  }
}

module.exports = { WelcomeEmail }
