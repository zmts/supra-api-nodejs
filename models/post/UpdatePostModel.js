const baseSchema = require('./baseSchema')
const BaseModel = require('../BaseModel')

class UpdatePostModel extends BaseModel {
  get schema () {
    return {
      ...baseSchema
    }
  }
}

module.exports = UpdatePostModel
