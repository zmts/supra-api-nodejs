const { assert } = require('supra-core')

const { UserModel } = require('../../../../models/UserModel')
const { app } = require('../../../../config')
const { expiresIn } = require('../../../../config').token.resetPassword

class ResetPasswordEmail {
  constructor ({ to, resetPasswordToken } = {}) {
    assert.object(arguments[0], { required: true })
    assert.validate(to, UserModel.schema.email, { required: true })
    assert.validate(resetPasswordToken, UserModel.schema.resetPasswordToken, { required: true })

    this.to = to
    this.subject = `[${app.name}] Password reset instructions`
    this.text = `Hi there! We received a request to reset your ${app.name} account password.

To to reset password please follow this link >> ${app.url}/a/reset-password?resetPasswordToken=${resetPasswordToken}

If you did not request a password reset, feel free to disregard this email - your password will not be changed.
If you don’t use this link within ${expiresIn}, it will expire.

Thanks,
The ${app.name} Team`
  }
}

module.exports = { ResetPasswordEmail }
