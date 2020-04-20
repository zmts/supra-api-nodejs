const joi = require('@hapi/joi')
const BaseModel = require('../core/BaseModel')
const Rule = require('../core/Rule')

const schema = {
  id: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.number().integer().positive())
      } catch (e) { return e.message }
      return true
    },
    description: 'number integer positive'
  }),
  title: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.string().min(3).max(20))
      } catch (e) { return e.message }
      return true
    },
    description: 'string; min 3; max 20;'
  }),
  content: new Rule({
    validator: v => {
      try {
        joi.assert(v, joi.string().min(3).max(5000))
      } catch (e) { return e.message }
      return true
    },
    description: 'string; min 3; max 5000;'
  }),
  test: new Rule({
    validator: v => {
      const result = joi.object({
        hello: joi.string().min(3).max(20),
        bye: joi.string().min(3).max(20)
      })
      return result.error && result.error.message || true
    },
    description: 'object; { hello: string, bye: string };'
  })
}

class TemplateModel extends BaseModel {
  static get schema () {
    return schema
  }
}

module.exports = { TemplateModel }
