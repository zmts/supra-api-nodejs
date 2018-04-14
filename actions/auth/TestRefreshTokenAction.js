// const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

class TestRefreshTokenAction extends BaseAction {
  static get validationRules () {
    return {
      ...this.baseValidationRules
      // body: Joi.object().keys({
      //   refreshToken: Joi.string().required()
      // })
    }
  }

  static run (req, res, next) {
    this.validate(req, this.validationRules)
      .then(() => UserDAO._GetRefreshTokensCount(1))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = TestRefreshTokenAction
