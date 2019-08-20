const joi = require('@hapi/joi')
const BaseModel = require('../core/BaseModel')
const Rule = require('../core/Rule')

const schema = {
  id: new Rule({
    validator: v => joi.validate(v, joi.number().integer().positive(), e => e ? e.message : true),
    description: 'number integer positive'
  }),
  title: new Rule({
    validator: v => joi.validate(v, joi.string().min(3).max(20), e => e ? e.message : true),
    description: 'string; min 3; max 20;'
  }),
  content: new Rule({
    validator: v => joi.validate(v, joi.string().min(3).max(5000), e => e ? e.message : true),
    description: 'string; min 3; max 5000;'
  }),
  test: new Rule({
    validator: v => joi.validate(v, {
      hello: joi.string().min(3).max(20),
      bye: joi.string().min(3).max(20)
    }, e => e ? e.message : true),
    description: 'object; { hello: string, bye: string };'
  })
}

class TemplateModel extends BaseModel {
  static get schema () {
    return schema
  }
}

module.exports = TemplateModel
