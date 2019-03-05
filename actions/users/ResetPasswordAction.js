const Joi = require('joi')

const BaseAction = require('../BaseAction')
const { jwtService, makePasswordHashService } = require('../../services/auth')
const config = require('../../config')
const UserDAO = require('../../dao/UserDAO')
const ErrorWrapper = require('../../core/ErrorWrapper')
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
      body: Joi.object().keys({
        resetPasswordToken: Joi.string().required(),
        password: Joi.string().required()
      })
    }
  }

  static async run (req, res) {
    const tokenData = await jwtService.verify(req.body.resetPasswordToken, config.token.resetEmail)
    const tokenUserId = +tokenData.sub
    const user = await UserDAO.BaseGetById(tokenUserId)
    if (user.resetEmailToken !== req.body.resetPasswordToken) throw new ErrorWrapper({ ...errorCodes.WRONG_RESET_PASSWORD_TOKEN })
    const passwordHash = await makePasswordHashService(req.body.password)
    await UserDAO.BaseUpdate(tokenUserId, { passwordHash, resetEmailToken: '', refreshTokensMap: {} })
    res.json(this.resJson({ message: 'Reset password process was successfully applied' }))
  }
}

module.exports = ResetPasswordAction
