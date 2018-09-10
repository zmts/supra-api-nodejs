// const joi = require('joi')
const BaseModel = require('../BaseModel')
const baseSchema = require('./baseSchema')

class UpdateUserModel extends BaseModel {
  static get schema () {
    return {
      ...baseSchema
    }
  }
}

module.exports = UpdateUserModel
