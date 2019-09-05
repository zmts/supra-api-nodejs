const BaseAction = require('../BaseAction')
const { emailClient } = require('../RootProvider')
const UserDAO = require('../../dao/UserDAO')
const UserModel = require('../../models/UserModel')
const { makeResetEmailTokenHelper } = require('../../helpers/auth')

/**
 * 1) get email from request
 * 2) find user in DB by email
 * 3) generate and store resetEmailToken to DB
 * 4) send reset email
 */
class SendResetEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:send-reset-email'
  }

  static get validationRules () {
    return {
      body: {
        email: [UserModel.schema.email, true]
      }
    }
  }

  static async run (ctx) {
    const user = await UserDAO.getByEmail(ctx.body.email)
    const resetEmailToken = await makeResetEmailTokenHelper(user)
    await UserDAO.baseUpdate(user.id, { resetEmailToken })
    const response = await emailClient.send({
      to: user.email,
      subject: '[Supra.com] Password reset instructions',
      text: `Use this token to reset password ${resetEmailToken}`
    })

    return this.result({ data: response })
  }
}

module.exports = SendResetEmailAction
