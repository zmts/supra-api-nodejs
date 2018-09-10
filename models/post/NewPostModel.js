const joi = require('joi')
const baseSchema = require('./baseSchema')
const BaseModel = require('../BaseModel')

class NewPostModel extends BaseModel {
  static get schema () {
    return {
      userId: joi.number().required(),
      ...baseSchema
    }
  }
}

module.exports = NewPostModel
