const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const UserModel = require('../../models/UserModel')
const SessionDAO = require('../../dao/SessionDAO')
const { checkPasswordHelper, makePasswordHashHelper } = require('../../helpers/auth')

class ChangePasswordAction extends BaseAction {
  static get accessTag () {
    return 'users:change-password'
  }

  static get validationRules () {
    return {
      body: {
        oldPassword: new RequestRule(UserModel.schema.passwordHash, true),
        newPassword: new RequestRule(UserModel.schema.passwordHash, true)
      }
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx

    const userModel = await UserDAO.baseGetById(currentUser.id)
    await checkPasswordHelper(ctx.body.oldPassword, userModel.passwordHash)
    const newHash = await makePasswordHashHelper(ctx.body.newPassword)

    await Promise.all([
      SessionDAO.baseRemoveWhere({ userId: currentUser.id }), // Changing password will remove all logged in sessions.
      UserDAO.baseUpdate(currentUser.id, { passwordHash: newHash })
    ])

    return this.result({ message: 'Password changed' })
  }
}

module.exports = ChangePasswordAction
