const joi = require('joi')
const BaseModel = require('../BaseModel')

class PostModel extends BaseModel {
  static get schema () {
    return {
      id: joi.number().required(),
      userId: joi.number().required(),
      title: joi.string().min(3).max(20).required(),
      content: joi.string().min(3).max(5000),
      createdAt: joi.date(),
      updatedAt: joi.date()
    }
  }
}

module.exports = PostModel
