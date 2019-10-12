const { assert } = require('supra-core')

const UserModel = require('../models/UserModel')
const { app } = require('../config')

class WelcomeEmail {
  constructor ({ to, username } = {}) {
    assert.object(arguments[0], { required: true })
    assert.validate(to, UserModel.schema.email, { required: true })
    assert.validate(username, UserModel.schema.username, { required: true })

    this.to = to
    this.subject = `[${app.name}] Welcome on board!`
    this.text = `Welcome to ${app.name}!
${username} we just created new account for you. Your login: ${to}

Looking forward to working with you!

Cheers,
The ${app.name} Team`
  }
}

module.exports = WelcomeEmail
