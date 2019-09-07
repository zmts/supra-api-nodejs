const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const Rule = require('../core/Rule')
const UserModel = require('../models/UserModel')

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
      body: {
        id: new RequestRule(UserModel.schema.id, true),
        name: new RequestRule(UserModel.schema.name),
        test: new RequestRule(new Rule({
          validator: v => typeof v === 'string' && v.length >= 8,
          description: 'string; min 8 chars;'
        }))
      }
    }
  }

  static run (ctx) {
    return this.result({})
  }
}

module.exports = TemplateAction
