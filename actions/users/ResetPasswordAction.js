const { errorCodes, ErrorWrapper, Rule, RequestRule } = require('supra-core')
const isJWT = require('validator/lib/isJWT')
const BaseAction = require('../BaseAction')
const { jwtHelper, makePasswordHashHelper } = require('../../auth')
const config = require('../../config')
const UserDAO = require('../../dao/UserDAO')
const UserModel = require('../../models/UserModel')

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
      body: {
        password: new RequestRule(UserModel.schema.passwordHash, { required: true }),
        resetPasswordToken: new RequestRule(new Rule({
          validator: v => isJWT(v),
          description: 'string; jwt;'
        }), { required: true })
      }
    }
  }

  static async run (ctx) {
    const tokenData = await jwtHelper.verify(ctx.body.resetPasswordToken, config.token.resetEmail)
    const tokenUserId = +tokenData.sub
    const user = await UserDAO.baseGetById(tokenUserId)
    if (user.resetEmailToken !== ctx.body.resetPasswordToken) throw new ErrorWrapper({ ...errorCodes.WRONG_RESET_PASSWORD_TOKEN })
    const passwordHash = await makePasswordHashHelper(ctx.body.password)
    await UserDAO.baseUpdate(tokenUserId, { passwordHash, resetEmailToken: '', refreshTokensMap: {} })

    return this.result({ message: 'Reset password process was successfully applied' })
  }
}

module.exports = ResetPasswordAction
