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
      ...this.baseValidationRules,
      body: Joi.object().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
      })
    }
  }

  static run (req, res, next) {
    let currentUser = registry.getCurrentUser()

    this.init(req, this.validationRules, this.accessTag)
      .then(() => UserDAO.BaseGetById(currentUser.id))
      .then(userModel => authModule.checkPasswordService(req.body.oldPassword, userModel.passwordHash))
      .then(() => authModule.makePasswordHashService(req.body.newPassword))
      .then(newHash => UserDAO.BaseUpdate(currentUser.id, { passwordHash: newHash }))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = ChangePasswordAction
