const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { jwtService } = require('../../services/auth')
const config = require('../../config')
const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

class ConfirmEmailAction extends BaseAction {
  static get accessTag () {
    return 'users:confirm-email'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        emailConfirmToken: Joi.string().required()
      })
    }
  }

  static run (req, res, next) {
    let tokenUserId = null

    this.init(req, this.validationRules, this.accessTag)
      .then(() => jwtService.verify(req.body.emailConfirmToken, config.token.emailConfirm.secret))
      .then(tokenData => {
        tokenUserId = +tokenData.sub
        return UserDAO.BaseGetById(tokenUserId)
      })
      .then(user => {
        if (user.emailConfirmToken === req.body.emailConfirmToken) {
          return UserDAO.BaseUpdate(tokenUserId, { isEmailConfirmed: true, emailConfirmToken: null })
        }
        throw new ErrorWrapper({ ...errorCodes.WRONG_EMAIL_CONFIRM_TOKEN })
      })
      .then(data => res.json(this.resJson({ data })))
      .catch(error => next(error))
  }
}

module.exports = ConfirmEmailAction
