const joi = require('joi')
const BaseModel = require('../BaseModel')

class UpdateUserModel extends BaseModel {
  static get schema () {
    return {
      name: joi.string().min(3).max(50),
      username: joi.string().min(3).max(25),
      isEmailConfirmed: joi.boolean()
    }
  }
}

module.exports = UpdateUserModel
