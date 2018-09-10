const joi = require('joi')
const BaseModel = require('../BaseModel')
const baseSchema = require('./baseSchema')

class UserModel extends BaseModel {
  static get schema () {
    return {
      ...baseSchema,
      email: joi.string().email().min(6).max(30).required()
    }
  }
}

module.exports = UserModel
