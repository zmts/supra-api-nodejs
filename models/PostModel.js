const joi = require('joi')
const { BaseModel, Rule } = require('supra-core')

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
  userId: new Rule({
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
  })
}

class PostModel extends BaseModel {
  static get schema () {
    return schema
  }
}

module.exports = { PostModel }
