const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { jwtService } = require('../../services/auth')
const config = require('../../config')
const ErrorWrapper = require('../../core/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

class ConfirmEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:confirm-email'
  }

  static get validationRules () {
    return {
      body: this.joi.object().keys({
        emailConfirmToken: this.joi.string().required()
      })
    }
  }

  static async run (req) {
    const tokenData = await jwtService.verify(req.body.emailConfirmToken, config.token.emailConfirm.secret)
    const tokenUserId = +tokenData.sub
    const user = await UserDAO.BaseGetById(tokenUserId)
    if (user.emailConfirmToken !== req.body.emailConfirmToken) {
      throw new ErrorWrapper({ ...errorCodes.WRONG_EMAIL_CONFIRM_TOKEN })
    }
    const data = await UserDAO.BaseUpdate(tokenUserId, { isEmailConfirmed: true, emailConfirmToken: null })

    return this.result({ data })
  }
}

module.exports = ConfirmEmailAction
