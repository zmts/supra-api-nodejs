const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const UserModel = require('../../models/UserModel')
const { jwtHelper } = require('../../auth')
const config = require('../../config')
const { errorCodes, ErrorWrapper } = require('supra-core')

class ConfirmEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:confirm-email'
  }

  static get validationRules () {
    return {
      body: {
        emailConfirmToken: new RequestRule(UserModel.schema.emailConfirmToken, { required: true })
      }
    }
  }

  static async run (ctx) {
    const tokenData = await jwtHelper.verify(ctx.body.emailConfirmToken, config.token.emailConfirm.secret)
    const userId = tokenData.sub
    const newEmail = tokenData.newEmail

    const user = await UserDAO.baseGetById(userId)
    if (user.emailConfirmToken !== ctx.body.emailConfirmToken) {
      throw new ErrorWrapper({ ...errorCodes.WRONG_EMAIL_CONFIRM_TOKEN })
    }
    await UserDAO.baseUpdate(userId, {
      email: newEmail,
      newEmail: null,
      emailConfirmToken: null
    })

    return this.result({ message: `${newEmail} confirmed` })
  }
}

module.exports = ConfirmEmailAction
