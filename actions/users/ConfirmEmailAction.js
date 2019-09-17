const { RequestRule } = require('supra-core')
const isJWT = require('validator/lib/isJWT')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { jwtHelper } = require('../../auth')
const config = require('../../config')
const { errorCodes, ErrorWrapper, Rule } = require('supra-core')

class ConfirmEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:confirm-email'
  }

  static get validationRules () {
    return {
      body: {
        emailConfirmToken: new RequestRule(new Rule({
          validator: v => isJWT(v),
          description: 'string; jwt;'
        }), true)
      }
    }
  }

  static async run (req) {
    const tokenData = await jwtHelper.verify(req.body.emailConfirmToken, config.token.emailConfirm.secret)
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
