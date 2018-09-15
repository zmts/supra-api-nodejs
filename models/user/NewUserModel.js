const joi = require('joi')
const BaseModel = require('../BaseModel')

class NewUserModel extends BaseModel {
  static get schema () {
    return {
      name: joi.string().min(3).max(50).required(),
      username: joi.string().min(3).max(25).required(),
      passwordHash: joi.string().required(),
      email: joi.string().email().min(6).max(30).required()
    }
  }
}

module.exports = NewUserModel
