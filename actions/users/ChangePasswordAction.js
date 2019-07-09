const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
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
    // TODO: Changing your password will invalidate all logged in sessions.
    const data = await UserDAO.baseUpdate(currentUser.id, { passwordHash: newHash })

    return this.result({ data })
  }
}

module.exports = ChangePasswordAction
