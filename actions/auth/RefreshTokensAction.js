const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { parseTokenService, makeAccessTokenService, makeRefreshTokenService, findAndVerifyRefreshToken } = require('../../services/auth')
const errorCodes = require('../../config').errorCodes

class RefreshTokensAction extends BaseAction {
  static get accessTag () {
    return 'auth:refresh-tokens'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        refreshToken: Joi.string().required()
      })
    }
  }

  static run (req, res, next) {
    let reqRefreshToken = req.body['refreshToken']
    let refreshTokenTimestamp = reqRefreshToken.split('::')[0]

    let userEntity = {}
    let responseData = { accessToken: '', refreshToken: '' }

    this.init(req, this.validationRules, this.accessTag)
      .then(() => {
        const refreshToken = reqRefreshToken.split('::')[1]
        return parseTokenService(refreshToken) // parse refresh token data (taken from request)
      })
      .then(refreshTokenData => UserDAO.BaseGetById(+refreshTokenData.sub)) // get user entity from DB
      .then(user => {
        userEntity = user
        return findAndVerifyRefreshToken(userEntity, reqRefreshToken)
      })
      .then(() => UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenTimestamp)) // remove old refresh token
      .then(() => makeRefreshTokenService(userEntity)) // make new refresh token
      .then(newRefreshToken => {
        responseData.refreshToken = newRefreshToken
        const newRefreshTokenTimestamp = newRefreshToken.split('::')[0]
        return UserDAO.AddRefreshTokenProcess(userEntity, { timestamp: newRefreshTokenTimestamp, refreshToken: newRefreshToken }) // store new refresh token to DB
      })
      .then(() => makeAccessTokenService(userEntity))
      .then(accessToken => (responseData.accessToken = accessToken))
      .then(() => res.json(this.resJson({ data: responseData })))
      .catch(error => {
        next(error)
        if (error.code === errorCodes.TOKEN_EXPIRED.code) {
          return UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenTimestamp) // remove refresh token in not valid
        }
      })
  }
}

module.exports = RefreshTokensAction
