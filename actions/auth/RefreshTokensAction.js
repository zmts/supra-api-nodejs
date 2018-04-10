const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const ErrorWrapper = require('../../util/ErrorWrapper')
const { cryptoService, parseTokenService, jwtService, makeAccessTokenService, makeRefreshTokenService } = require('../../services/auth')

const SECRET = require('../../config/token').refresh

class RefreshTokensAction extends BaseAction {
  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        refreshToken: Joi.string().required()
      })
    }
  }

  static run (req, res, next) {
    let refreshToken = req.body['refreshToken']

    let userEntity = {}
    let decodedRefreshToken = ''
    let data = { accessToken: '', refreshToken: '', expiresIn: 0 }

    this.validate(req, this.validationRules)
      .then(() => cryptoService.decrypt(refreshToken))
      .then(decodedRToken => {
        decodedRefreshToken = decodedRToken
        return parseTokenService(decodedRToken)
      })
      .then(refreshTokenData => UserDAO.GetByEmail(refreshTokenData.email))
      .then(user => {
        if (user.tokenRefresh === refreshToken) {
          userEntity = user
          return jwtService.verify(decodedRefreshToken, SECRET)
        }
        throw new ErrorWrapper('badRefreshToken', 401)
      })
      .then(() => makeAccessTokenService(userEntity))
      .then(accessTokenObj => {
        data.accessToken = accessTokenObj.accessToken
        data.expiresIn = accessTokenObj.expiresIn
      })
      .then(() => makeRefreshTokenService(userEntity))
      .tap(newRefreshToken => UserDAO.UPDATE(userEntity.id, { tokenRefresh: newRefreshToken }))
      .then(newRefreshToken => (data.refreshToken = newRefreshToken))
      .then(() => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = RefreshTokensAction
