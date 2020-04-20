const { assert } = require('supra-core')

const { UserModel } = require('../../../../models/UserModel')
const { app } = require('../../../../config')
const { expiresIn } = require('../../../../config').token.emailConfirm

class ChangeEmail {
  constructor ({ newEmail, emailConfirmToken } = {}) {
    assert.object(arguments[0], { required: true })
    assert.validate(newEmail, UserModel.schema.email, { required: true })
    assert.validate(emailConfirmToken, UserModel.schema.emailConfirmToken, { required: true })

    this.to = newEmail
    this.subject = `[${app.name}] Confirm new email`
    this.text = `To confirm email: ${newEmail} please follow this link >> ${app.url}/a/confirm-email?emailConfirmToken=${emailConfirmToken}

If you don’t use this link within ${expiresIn}, it will expire.

Thanks,
The ${app.name} Team`
  }
}

module.exports = { ChangeEmail }
