const isJWT = require('validator/lib/isJWT')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const Rule = require('../../core/Rule')
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
      body: {
        emailConfirmToken: [new Rule({
          validator: v => isJWT(v),
          description: 'string; jwt;'
        }), true]
      }
    }
  }

  static async run (req) {
    const tokenData = await jwtService.verify(req.body.emailConfirmToken, config.token.emailConfirm.secret)
    const tokenUserId = +tokenData.sub
    const user = await UserDAO.baseGetById(tokenUserId)
    if (user.emailConfirmToken !== req.body.emailConfirmToken) {
      throw new ErrorWrapper({ ...errorCodes.WRONG_EMAIL_CONFIRM_TOKEN })
    }
    const data = await UserDAO.baseUpdate(tokenUserId, { isEmailConfirmed: true, emailConfirmToken: null })

    return this.result({ data })
  }
}

module.exports = ConfirmEmailAction
