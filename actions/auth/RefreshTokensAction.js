const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { cryptoDecryptService, parseTokenService, jwtService, makeAccessTokenService, makeRefreshTokenService, findAndVerifyRefreshToken } = require('../../services/auth')
const ErrorWrapper = require('../../util/ErrorWrapper')
const errorCodes = require('../../config/errorCodes')

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
    let reqRefreshToken = req.body['refreshToken']
    let refreshTokenTimestamp = reqRefreshToken.split('.')[0]
    let decodedRefreshToken = ''

    let userEntity = {}
    let responseData = { accessToken: '', refreshToken: '', expiresIn: 0 }

    // TODO refact, make less DB queries
    this.validate(req, this.validationRules)
      .then(() => cryptoDecryptService(reqRefreshToken)) // decode refresh token taken from request
      .then(decodedRefToken => {
        decodedRefreshToken = decodedRefToken
        return parseTokenService(decodedRefToken) // parse refresh token data (taken from request)
      })
      .then(refreshTokenData => UserDAO.GET_BY_ID(+refreshTokenData.sub)) // get user entity from DB
      .then(user => {
        userEntity = user
        return findAndVerifyRefreshToken(userEntity, reqRefreshToken, decodedRefreshToken)
      })
      .then(() => makeAccessTokenService(userEntity))
      .then(accessTokenObj => {
        responseData.accessToken = accessTokenObj.accessToken
        responseData.expiresIn = accessTokenObj.expiresIn
      })
      .then(() => UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenTimestamp)) // remove old refresh token
      .then(() => makeRefreshTokenService(userEntity)) // make new refresh token
      .then(newRefreshToken => {
        responseData.refreshToken = newRefreshToken
        let refreshTokenTimestamp = newRefreshToken.split('.')[0]
        return UserDAO.AddRefreshTokenProcess(userEntity, { timestamp: refreshTokenTimestamp, refreshToken: newRefreshToken }) // store new refresh token to DB
      })
      .then(() => res.json({ data: responseData, success: true }))
      .catch(error => {
        next(error)
        if (error.code === errorCodes.TOKEN_EXPIRED.code) {
          return UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenTimestamp) // if not valid >> remove old refresh token
        }
      })
  }
}

module.exports = RefreshTokensAction
