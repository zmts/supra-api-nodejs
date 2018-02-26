const Joi = require('joi')
const BaseAction = require('../BaseAction')
const User = require('../../models/User')

/**
 * @description create user entity
 */
class CreateAction extends BaseAction {
  get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        name: Joi.string().min(3).max(30),
        email: Joi.string().email().min(6).max(30)
      })
    }
  }

  run (req, res, next) {
    req.meta.user.id = 1 // mock user_id
    // console.log(registry.list())

    this.isLoggedIn(req.meta.user)
      .then(() => this.validate(req, this.validationRules))
      .then(() => User.CREATE(req.body))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = CreateAction
