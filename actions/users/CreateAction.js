const Joi = require('joi')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const makePasswordHash = require('../../services/makePasswordHash')

/**
 * @description create user entity
 */
class CreateAction extends BaseAction {
  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        name: Joi.string().min(3).max(50),
        username: Joi.string().min(3).max(25),
        password: Joi.string().required(),
        email: Joi.string().email().min(6).max(30)
      })
    }
  }

  static run (req, res, next) {
    let body = req.body

    this.validate(req, this.validationRules)
      .then(() => makePasswordHash(body.password))
      .then(hash => {
        delete body.password
        body['passwordHash'] = hash
        return body
      }).then(body => UserDAO.CREATE(body))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = CreateAction
