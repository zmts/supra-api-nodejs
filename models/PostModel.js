const joi = require('@hapi/joi')
const { BaseModel, Rule } = require('../core')

const schema = {
  id: new Rule({
    validator: v => joi.validate(v, joi.number().integer().positive(), e => e ? e.message : true),
    description: 'number integer positive'
  }),
  userId: new Rule({
    validator: v => joi.validate(v, joi.number().integer().positive(), e => e ? e.message : true),
    description: 'number; integer; positive;'
  }),
  title: new Rule({
    validator: v => joi.validate(v, joi.string().min(3).max(20), e => e ? e.message : true),
    description: 'string; min 3; max 20;'
  }),
  content: new Rule({
    validator: v => joi.validate(v, joi.string().min(3).max(5000), e => e ? e.message : true),
    description: 'string; min 3; max 5000;'
  })
}

class PostModel extends BaseModel {
  static get schema () {
    return schema
  }
}

module.exports = PostModel
