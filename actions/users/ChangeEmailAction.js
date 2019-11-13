const { errorCodes, AppError, RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const UserModel = require('../../models/UserModel')
const makeEmailConfirmTokenHelper = require('../../auth/makeEmailConfirmTokenHelper')
const { emailClient } = require('../RootProvider')
const ChangeEmail = require('../../emails/ChangeEmail')

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

    const emailConfirmToken = await makeEmailConfirmTokenHelper({ ...currentUser, newEmail })
    await emailClient.send(new ChangeEmail({ newEmail, emailConfirmToken }))
    await UserDAO.baseUpdate(currentUser.id, { newEmail, emailConfirmToken })

    return this.result({ message: `User requested change email to ${newEmail}!` })
  }
}

module.exports = ChangeEmailAction
