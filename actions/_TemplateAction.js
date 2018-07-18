const Joi = require('joi')

const BaseAction = require('../BaseAction')
// const UserDAO = require('../../dao/UserDAO')
// const authModule = require('../../services/auth')
// const registry = require('../../registry')

class TemplateAction extends BaseAction {
  static get accessTag () {
    return 'template:template'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        templateField: Joi.string().required()
      })
    }
  }

  static run (req, res, next) {
    // let currentUser = registry.getCurrentUser()

    this.init(req, this.validationRules, this.accessTag)
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = TemplateAction
