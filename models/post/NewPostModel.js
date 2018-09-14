const joi = require('joi')
const BaseModel = require('../BaseModel')

class NewPostModel extends BaseModel {
  static get schema () {
    return {
      userId: joi.number().required(),
      title: joi.string().min(3).max(20).required(),
      content: joi.string().min(3).max(5000)
    }
  }
}

module.exports = NewPostModel
