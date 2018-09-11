// const joi = require('joi')
const BaseModel = require('../BaseModel')
const schema = require('./schema')

class UpdateUserModel extends BaseModel {
  static get schema () {
    return {
      ...schema.update
    }
  }
}

module.exports = UpdateUserModel
