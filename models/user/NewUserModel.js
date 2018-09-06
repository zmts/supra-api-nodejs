const BaseModel = require('../BaseModel')

class NewUserModel extends BaseModel {
  get schema () {
    return {
      name: this.joi.string().min(3).max(50),
      username: this.joi.string().min(3).max(25).required(),
      password: this.joi.string().required(), // stores in DB as passwordHash,
      email: this.joi.string().email().min(6).max(30).required()
    }
  }
}

module.exports = NewUserModel
