const joi = require('joi')
const baseSchema = require('./baseSchema')
const BaseModel = require('../BaseModel')

class PostModel extends BaseModel {
  static get schema () {
    return {
      ...baseSchema,
      id: joi.number().required(),
      userId: joi.number().required()
    }
  }
}

module.exports = PostModel
