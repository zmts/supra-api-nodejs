const Joi = require('joi')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

/**
 * @description update user entity
 */
class UpdateAction extends BaseAction {
  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        name: Joi.string().min(3).max(50)
      })
    }
  }

  static run (req, res, next) {
    // let userId = 'token.id' // TODO

    this.validate(req, this.validationRules)
      .then(body => UserDAO.UPDATE(1, req.body))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = UpdateAction
