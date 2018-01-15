const Joi = require('joi')
const BaseAction = require('../base')

/**
 * @description create user entity
 */
class Create extends BaseAction {
  get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        name: Joi.string().min(3).max(30),
        email: Joi.string().email().min(6).max(30),
        password: Joi.string().required()
      })
    }
  }

  run (req, res, next) {
    req.meta.user.id = 1 // mock user_id

    this.isLoggedIn(req.meta.user)
      .then(() => this.validate(req, this.validationRules))
      .then(() => res.json({ data: 'user created' }))
      .catch(error => next(error))
  }
}

module.exports = Create
