const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const authModule = require('../../services/auth')

/**
 * @description create user entity
 */
class CreateAction extends BaseAction {
  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        name: Joi.string().min(3).max(50),
        username: Joi.string().min(3).max(25).required(),
        password: Joi.string().required(),
        email: Joi.string().email().min(6).max(30).required()
      })
    }
  }

  static run (req, res, next) {
    this.validate(req, this.validationRules)
      .then(() => authModule.makePasswordHashService(req.body.password))
      .then(hash => {
        delete req.body.password
        req.body['passwordHash'] = hash
        return req.body
      }).then(body => UserDAO.CREATE(body))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = CreateAction
