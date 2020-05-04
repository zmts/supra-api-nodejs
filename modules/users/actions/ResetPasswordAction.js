const { errorCodes, AppError, RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { makePasswordHash } = require('../common/makePasswordHash')
const { jwtVerify } = require('../../../rootcommmon/jwt')
const { UserDAO } = require('../../../dao/UserDAO')
const { UserModel } = require('../../../models/UserModel')
const { RefreshSessionDAO } = require('../../../dao/RefreshSessionDAO')
const config = require('../../../config')

/**
 * 1) verify resetPasswordToken
 * 2) compare existing resetPasswordToken from DB and resetPasswordToken from request
 * 3) make hash from new password
 * 4) update user entity in DB with new hash, reset resetPasswordToken and refreshTokensMap
 */
class ResetPasswordAction extends BaseAction {
  static get accessTag () {
    return 'users:reset-password'
  }

  static get validationRules () {
    return {
      body: {
        resetPasswordToken: new RequestRule(UserModel.schema.resetPasswordToken, { required: true }),
        password: new RequestRule(UserModel.schema.passwordHash, { required: true })
      }
    }
  }

  static async run (ctx) {
    const tokenData = await jwtVerify(ctx.body.resetPasswordToken, config.token.resetPassword.secret)
    const tokenUserId = tokenData.sub
    const user = await UserDAO.baseGetById(tokenUserId)

    if (user.resetPasswordToken !== ctx.body.resetPasswordToken) {
      throw new AppError({ ...errorCodes.WRONG_RESET_PASSWORD_TOKEN })
    }
    const passwordHash = await makePasswordHash(ctx.body.password)

    await Promise.all([
      UserDAO.baseUpdate(tokenUserId, { passwordHash, resetPasswordToken: '' }),
      RefreshSessionDAO.baseRemoveWhere({ userId: tokenUserId })
    ])

    return this.result({ message: 'Reset password process was successfully applied' })
  }
}

module.exports = { ResetPasswordAction }
