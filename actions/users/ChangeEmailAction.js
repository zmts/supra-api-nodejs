const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const UserModel = require('../../models/UserModel')
const ErrorWrapper = require('../../core/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

class ChangeEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:change-email'
  }

  static get validationRules () {
    return {
      body: {
        email: [UserModel.schema.email, true]
      }
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx
    const email = ctx.body.email

    const isExist = await UserDAO.isEmailExist(email)
    if (isExist) throw new ErrorWrapper({ ...errorCodes.EMAIL_ALREADY_TAKEN })
    await UserDAO.baseUpdate(currentUser.id, { email, isEmailConfirmed: false })

    return this.result({ message: `Email was changed to ${email}!` })
  }
}

module.exports = ChangeEmailAction
