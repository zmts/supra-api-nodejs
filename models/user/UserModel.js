const joi = require('joi')
const BaseModel = require('../BaseModel')

class UserModel extends BaseModel {
  static get schema () {
    return {
      id: joi.number(),
      name: joi.string().min(3).max(50),
      username: joi.string().min(3).max(25),
      email: joi.string().email().min(6).max(30),
      isEmailConfirmed: joi.boolean()
    }
  }
}

module.exports = UserModel
