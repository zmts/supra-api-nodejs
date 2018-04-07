const Joi = require('joi')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

class LoginAction extends BaseAction {
  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        password: Joi.string().required(),
        email: Joi.string().email().min(6).max(30).required()
      })
    }
  }

  static run (req, res, next) {
    this.validate(req, this.validationRules)
      .then(() => UserDAO.GetByEmail(req.body.email))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = LoginAction
