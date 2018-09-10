const joi = require('joi')
const BaseModel = require('../BaseModel')
const baseSchema = require('./baseSchema')

class NewUserModel extends BaseModel {
  static get schema () {
    return {
      ...baseSchema,
      passwordHash: joi.string().required(),
      email: joi.string().email().min(6).max(30).required()
    }
  }
}

module.exports = NewUserModel
