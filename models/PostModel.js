const joi = require('@hapi/joi')
const BaseModel = require('./BaseModel')

class PostModel extends BaseModel {
  static get schema () {
    return schema
  }
}

const schema = {
  id: {
    validator: v => joi.validate(v, joi.number().integer().positive(), e => !e),
    default: null,
    description: 'number integer positive'
  },
  title: {
    validator: v => joi.validate(v, joi.string().min(3).max(20), e => !e),
    default: null,
    description: 'min 3; max 20;'
  },
  content: {
    validator: v => joi.validate(v, joi.string().min(3).max(5000), e => !e),
    default: null,
    description: 'min 3; max 5000;'
  }
}

module.exports = PostModel
