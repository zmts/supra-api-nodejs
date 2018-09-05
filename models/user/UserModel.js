const BaseModel = require('../BaseModel')

class UserModel extends BaseModel { // TODO
  get schema () {
    return {
      name: this.joi.string().min(3).max(50),
      username: this.joi.string().min(3).max(25).required(),
      email: this.joi.string().email().min(6).max(30).required()
    }
  }
}

module.exports = UserModel
