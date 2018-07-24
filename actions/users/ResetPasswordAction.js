const Joi = require('joi')

const BaseAction = require('../BaseAction')
const { jwtService, makePasswordHashService } = require('../../services/auth')
const config = require('../../config')
const UserDAO = require('../../dao/UserDAO')
const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

/**
 * 1) verify resetPasswordToken
 * 2) compare existing resetPasswordToken from DB and resetPasswordToken from request
 * 3) make hash from new password
 * 4) update user entity in DB with new hash, reset resetEmailToken and refreshTokensMap
 */
class ResetPasswordAction extends BaseAction {
  static get accessTag () {
    return 'users:reset-password'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        resetPasswordToken: Joi.string().required(),
        password: Joi.string().required()
      })
    }
  }

  static run (req, res, next) {
    let tokenUserId = null

    this.init(req, this.validationRules, this.accessTag)
      .then(() => jwtService.verify(req.body.resetPasswordToken, config.token.resetEmail))
      .then(tokenData => {
        tokenUserId = +tokenData.sub
        return UserDAO.BaseGetById(tokenUserId)
      })
      .then(user => {
        if (user.resetEmailToken === req.body.resetPasswordToken) return makePasswordHashService(req.body.password)
        throw new ErrorWrapper({ ...errorCodes.WRONG_RESET_PASSWORD_TOKEN })
      })
      .then(passwordHash => UserDAO.BaseUpdate(tokenUserId, { passwordHash, resetEmailToken: '', refreshTokensMap: {} }))
      .then(() => res.json(this.resJson({ message: 'Reset password process was successfully applied' })))
      .catch(error => next(error))
  }
}

module.exports = ResetPasswordAction
