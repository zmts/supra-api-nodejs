// const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

class GetRefreshTokensAction extends BaseAction {
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
      .then(() => UserDAO.RemoveRefreshToken(2, '60f4e6d2599521096e7b5e2c90b33e0d'))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = GetRefreshTokensAction
