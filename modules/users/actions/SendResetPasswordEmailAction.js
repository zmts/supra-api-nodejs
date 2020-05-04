const { RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { emailAgent } = require('../../RootProvider')
const { UserDAO } = require('../../../dao/UserDAO')
const { UserModel } = require('../../../models/UserModel')
const { makeResetPasswordToken } = require('../common/makeResetPasswordToken')
const { ResetPasswordEmail } = require('../common/emails/ResetPasswordEmail')

/**
 * 1) get email from body request
 * 2) find user in DB by email
 * 3) generate and store resetPasswordToken to DB
 * 4) send reset email
 */
class SendResetPasswordEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:send-reset-password-email'
  }

  static get validationRules () {
    return {
      body: {
        email: new RequestRule(UserModel.schema.email, { required: true })
      }
    }
  }

  static async run (ctx) {
    const user = await UserDAO.getByEmail(ctx.body.email)
    const resetPasswordToken = await makeResetPasswordToken(user)
    await UserDAO.baseUpdate(user.id, { resetPasswordToken })

    await emailAgent.send(new ResetPasswordEmail({ to: user.email, resetPasswordToken }))

    return this.result({ message: 'Reset password email delivered' })
  }
}

module.exports = { SendResetPasswordEmailAction }
