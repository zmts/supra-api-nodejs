const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const SessionDAO = require('../../dao/SessionDAO')
const authModule = require('../../services/auth')

class ChangePasswordAction extends BaseAction {
  static get accessTag () {
    return 'users:change-password'
  }

  static get validationRules () {
    return {
      body: this.joi.object().keys({
        oldPassword: this.joi.string().required(),
        newPassword: this.joi.string().required()
      })
    }
  }

  static async run (req) {
    const { currentUser } = req

    const userModel = await UserDAO.baseGetById(currentUser.id)
    await authModule.checkPasswordService(req.body.oldPassword, userModel.passwordHash)
    const newHash = await authModule.makePasswordHashService(req.body.newPassword)

    await Promise.all([
      SessionDAO.baseRemoveWhere({ userId: currentUser.id }), // Changing password will remove all logged in sessions.
      UserDAO.baseUpdate(currentUser.id, { passwordHash: newHash })
    ])

    return this.result({ message: 'Password changed' })
  }
}

module.exports = ChangePasswordAction
