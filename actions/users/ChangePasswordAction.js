const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const authModule = require('../../services/auth')
const registry = require('../../registry')

class ChangePasswordAction extends BaseAction {
  static get accessTag () {
    return 'users:change-password'
  }

  static get validationRules () {
    return {
      body: Joi.object().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
      })
    }
  }

  static async run (req, res) {
    const currentUser = registry.currentUser.get()
    const userModel = await UserDAO.BaseGetById(currentUser.id)
    await authModule.checkPasswordService(req.body.oldPassword, userModel.passwordHash)
    const newHash = await authModule.makePasswordHashService(req.body.newPassword)
    const data = await UserDAO.BaseUpdate(currentUser.id, { passwordHash: newHash })
    res.json(this.resJson({ data }))
  }
}

module.exports = ChangePasswordAction
