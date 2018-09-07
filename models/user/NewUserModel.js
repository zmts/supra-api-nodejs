const joi = require('joi')
const BaseModel = require('../BaseModel')
const schema = {
  name: joi.string().min(3).max(50),
  username: joi.string().min(3).max(25).required(),
  passwordHash: joi.string().required(),
  email: joi.string().email().min(6).max(30).required()
}

class NewUserModel extends BaseModel {
  get schema () { return schema }
}

module.exports = { model: NewUserModel, schema }
