const joi = require('joi')
const BaseModel = require('../BaseModel')
const schema = require('./schema')

class UserFullModel extends BaseModel {
  static get schema () {
    return {
      ...schema.update,
      id: joi.number(),
      email: joi.string().email().min(6).max(30)
    }
  }
}

module.exports = UserFullModel
