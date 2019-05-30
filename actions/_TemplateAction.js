const Joi = require('@hapi/joi')

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
      params: {},
      query: {
        ...this.baseQueryParams
      },
      body: Joi.object().keys({
        templateField: Joi.string().required()
      })
    }
  }

  static run (req) {
    //
  }
}

module.exports = TemplateAction
