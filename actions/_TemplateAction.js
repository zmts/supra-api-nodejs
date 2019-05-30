const BaseAction = require('../BaseAction')
// const UserDAO = require('../../dao/UserDAO')

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
      body: this.joi.object().keys({
        templateField: this.joi.string().required()
      })
    }
  }

  static run (ctx) {
    return this.result({})
  }
}

module.exports = TemplateAction
