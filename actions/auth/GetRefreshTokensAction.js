const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { cryptoService, parseTokenService } = require('../../services/auth')

class GetRefreshTokensAction extends BaseAction {
  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        refreshToken: Joi.string().required()
      })
    }
  }

  static run (req, res, next) {
    let refreshToken = req.body.refreshToken
    let iv = req.body.refreshToken.split('::')[0]

    this.validate(req, this.validationRules)
      .then(() => cryptoService.decrypt(refreshToken))
      .then(decodedRToken => parseTokenService(decodedRToken))
      .then(refreshTokenData => UserDAO.GetRefreshTokensByUserEmail(refreshTokenData.email, iv))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = GetRefreshTokensAction
