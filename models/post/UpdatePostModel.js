const joi = require('joi')
const BaseModel = require('../BaseModel')

class UpdatePostModel extends BaseModel {
  static get schema () {
    return {
      title: joi.string().min(3).max(20),
      content: joi.string().min(3).max(5000)
    }
  }
}

module.exports = UpdatePostModel
