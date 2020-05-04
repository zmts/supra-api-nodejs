const { errorCodes, AppError, RequestRule } = require('supra-core')

const { ChangeEmail } = require('../common/emails/ChangeEmail')
const { makeEmailConfirmToken } = require('../common/makeEmailConfirmToken')
const { emailAgent } = require('../../RootProvider')
const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')
const { UserModel } = require('../../../models/UserModel')

class ChangeEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:change-email'
  }

  static get validationRules () {
    return {
      body: {
        newEmail: new RequestRule(UserModel.schema.email, { required: true })
      }
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx
    const { newEmail } = ctx.body

    const isExist = await UserDAO.isEmailExist(newEmail)
    if (isExist) throw new AppError({ ...errorCodes.EMAIL_ALREADY_TAKEN })

    const emailConfirmToken = await makeEmailConfirmToken({ ...currentUser, newEmail })
    await emailAgent.send(new ChangeEmail({ newEmail, emailConfirmToken }))
    await UserDAO.baseUpdate(currentUser.id, { newEmail, emailConfirmToken })

    return this.result({ message: `User requested change email to ${newEmail}!` })
  }
}

module.exports = { ChangeEmailAction }
