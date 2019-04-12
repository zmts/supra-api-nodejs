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
      query: {
        ...this.baseQueryParams
      },
      body: Joi.object().keys({
        templateField: Joi.string().required()
      })
    }
  }

  static run (req, res, next) {
    // let currentUser = registry.get()

    this.init(req, this.validationRules, this.accessTag)
      .then(data => res.json(this.resJson({ data })))
      .catch(error => next(error))
  }
}

module.exports = TemplateAction
