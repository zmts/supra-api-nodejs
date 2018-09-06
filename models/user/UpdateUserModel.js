const BaseModel = require('../BaseModel')

class UpdateUserModel extends BaseModel {
  get schema () {
    return {
      name: this.joi.string().min(3).max(50),
      username: this.joi.string().min(3).max(25).required()
    }
  }
}

module.exports = UpdateUserModel
