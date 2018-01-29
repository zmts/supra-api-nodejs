const Joi = require('joi')
const BaseAction = require('../Base')
const UserRepo = require('../../repository/User')
// const registry = require('../../registry')

/**
 * @description create user entity
 */
class Create extends BaseAction {
  get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        username: Joi.string().min(3).max(30),
        email: Joi.string().email().min(6).max(30)
      })
    }
  }

  run (req, res, next) {
    req.meta.user.id = 1 // mock user_id
    // console.log(registry.list())

    this.isLoggedIn(req.meta.user)
      .then(() => this.validate(req, this.validationRules))
      .then(() => UserRepo.CREATE(req.body))
      .then(model => res.json({ data: model }))
      .catch(error => next(error))
  }
}

module.exports = Create
