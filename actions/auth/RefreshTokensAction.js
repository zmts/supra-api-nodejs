const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { cryptoDecryptService, parseTokenService, makeAccessTokenService, makeRefreshTokenService, findAndVerifyRefreshToken } = require('../../services/auth')
const errorCodes = require('../../config/errorCodes')

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
      .then(() => UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenTimestamp)) // remove old refresh token
      .then(() => makeRefreshTokenService(userEntity)) // make new refresh token
      .then(newRefreshToken => {
        responseData.refreshToken = newRefreshToken
        let newRefreshTokenTimestamp = newRefreshToken.split('.')[0]
        return UserDAO.AddRefreshTokenProcess(userEntity, { timestamp: newRefreshTokenTimestamp, refreshToken: newRefreshToken }) // store new refresh token to DB
      })
      .then(() => makeAccessTokenService(userEntity))
      .then(accessTokenObj => {
        responseData.accessToken = accessTokenObj.accessToken
        responseData.expiresIn = accessTokenObj.expiresIn
      })
      .then(() => res.json({ data: responseData, success: true }))
      .catch(error => {
        next(error)
        if (error.code === errorCodes.TOKEN_EXPIRED.code) {
          return UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenTimestamp) // remove refresh token in not valid
        }
      })
  }
}

module.exports = RefreshTokensAction
