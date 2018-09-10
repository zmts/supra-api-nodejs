const joi = require('joi')

module.exports = {
  name: joi.string().min(3).max(50),
  username: joi.string().min(3).max(25).required()
}
