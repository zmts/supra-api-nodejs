const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { cryptoDecryptService, parseTokenService, jwtService, makeAccessTokenService, makeRefreshTokenService } = require('../../services/auth')
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
    let refreshToken = req.body['refreshToken']
    let refreshTokenTimestamp = refreshToken.split('.')[0]
    let decodedRefreshToken = ''
    let parsedRefreshTokenData = {}

    let userEntity = {}
    let responseData = { accessToken: '', refreshToken: '', expiresIn: 0 }

    // TODO refact, make less DB queries
    this.validate(req, this.validationRules)
      .then(() => cryptoDecryptService(refreshToken)) // decode refresh token taken from request
      .then(decodedRefToken => {
        decodedRefreshToken = decodedRefToken
        return parseTokenService(decodedRefToken) // parse refresh token data (taken from request)
      })
      .then(refreshTokenData => {
        parsedRefreshTokenData = refreshTokenData
        return UserDAO.GET_BY_ID(+refreshTokenData.sub) // get user entity from DB
      })
      .then(user => (userEntity = user))
      .then(() => UserDAO.GetRefreshToken(+parsedRefreshTokenData.sub, refreshTokenTimestamp)) // get refresh token from DB by userId and refreshTokenTimestamp
      .then(refreshTokenFromDB => {
        if (refreshTokenFromDB === refreshToken) { // compare refresh token from DB and refresh token from request
          return jwtService.verify(decodedRefreshToken, SECRET) // verify refresh token
            .catch(error => {
              UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenTimestamp) // if not valid >> remove old refresh token
              throw error
            })
        }
        throw new ErrorWrapper({ ...errorCodes.BAD_REFRESH_TOKEN })
      })
      .then(() => makeAccessTokenService(userEntity))
      .then(accessTokenObj => {
        responseData.accessToken = accessTokenObj.accessToken
        responseData.expiresIn = accessTokenObj.expiresIn
      })
      .then(() => UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenTimestamp)) // remove old refresh token
      .then(() => makeRefreshTokenService(userEntity)) // make new refresh token
      .tap(newRefreshToken => {
        let refreshTokenTimestamp = newRefreshToken.split('.')[0]
        return UserDAO.AddRefreshTokenProcess(userEntity.id, { timestamp: refreshTokenTimestamp, refreshToken: newRefreshToken }) // store new refresh token to DB
      })
      .then(newRefreshToken => (responseData.refreshToken = newRefreshToken))
      .then(() => res.json({ data: responseData, success: true }))
      .catch(error => next(error))
  }
}

module.exports = RefreshTokensAction
