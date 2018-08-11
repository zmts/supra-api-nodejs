const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const registry = require('../../registry')

class UpdateAction extends BaseAction {
  static get accessTag () {
    return 'users:update'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        name: Joi.string().min(3).max(50)
      })
    }
  }

  static run (req, res, next) {
    let currentUser = registry.currentUser.get()

    this.init(req, this.validationRules, this.accessTag)
      .then(() => UserDAO.BaseUpdate(currentUser.id, req.body)) // user can update only itself
      .then(updatedModel => res.json(this.resJson({ data: updatedModel })))
      .catch(error => next(error))
  }
}

module.exports = UpdateAction
