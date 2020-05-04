const { RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')
const { UserModel } = require('../../../models/UserModel')
const { RefreshSessionDAO } = require('../../../dao/RefreshSessionDAO')
const { makePasswordHash } = require('../common/makePasswordHash')
const { checkPassword } = require('../../../rootcommmon/checkPassword')

class ChangePasswordAction extends BaseAction {
  static get accessTag () {
    return 'users:change-password'
  }

  static get validationRules () {
    return {
      body: {
        oldPassword: new RequestRule(UserModel.schema.passwordHash, { required: true }),
        newPassword: new RequestRule(UserModel.schema.passwordHash, { required: true })
      }
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx

    const userModel = await UserDAO.baseGetById(currentUser.id)
    await checkPassword(ctx.body.oldPassword, userModel.passwordHash)
    const newHash = await makePasswordHash(ctx.body.newPassword)

    await Promise.all([
      RefreshSessionDAO.baseRemoveWhere({ userId: currentUser.id }), // Changing password will remove all logged in refresh sessions
      UserDAO.baseUpdate(currentUser.id, { passwordHash: newHash })
    ])

    return this.result({ message: 'Password changed' })
  }
}

module.exports = { ChangePasswordAction }
