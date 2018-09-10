const joi = require('joi')

module.exports = {
  title: joi.string().min(3).max(20),
  content: joi.string().min(3).max(5000).required()
}
