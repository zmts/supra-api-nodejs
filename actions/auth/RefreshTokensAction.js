const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const {
  parseTokenService,
  makeAccessTokenService,
  makeRefreshTokenService,
  findAndVerifyRefreshToken
} = require('../../services/auth')
const { errorCodes } = require('../../config')
const ErrorWrapper = require('../../core/ErrorWrapper')

class RefreshTokensAction extends BaseAction {
  static get accessTag () {
    return 'auth:refresh-tokens'
  }

  static get validationRules () {
    return {
      body: Joi.object().keys({
        refreshToken: Joi.string().required()
      })
    }
  }

  static async run (req) {
    const reqRefreshToken = req.body['refreshToken']

    if (!reqRefreshToken.includes('::')) {
      throw new ErrorWrapper({ ...errorCodes.BAD_REQUEST, message: 'Refresh token. Wrong format' })
    }

    const refreshTokenTimestamp = reqRefreshToken.split('::')[0]
    const refreshToken = reqRefreshToken.split('::')[1]
    const responseData = { accessToken: '', refreshToken: '' }
    let userEntity = {}

    try {
      const refreshTokenData = await parseTokenService(refreshToken) // parse refresh token data (taken from request)
      userEntity = await UserDAO.BaseGetById(+refreshTokenData.sub) // get user entity from DB
      await findAndVerifyRefreshToken(userEntity, reqRefreshToken)
      await UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenTimestamp) // remove old refresh token
      const newRefreshToken = await makeRefreshTokenService(userEntity) // make new refresh token
      responseData.refreshToken = newRefreshToken
      const newRefreshTokenTimestamp = newRefreshToken.split('::')[0]
      await UserDAO.AddRefreshTokenProcess(userEntity, { timestamp: newRefreshTokenTimestamp, refreshToken: newRefreshToken }) // store new refresh token to DB
      responseData.accessToken = await makeAccessTokenService(userEntity)

      return this.result({ data: responseData })
    } catch (error) {
      if (error.code === errorCodes.TOKEN_EXPIRED.code) {
        await UserDAO.RemoveRefreshToken(+userEntity.id, refreshTokenTimestamp) // remove refresh token in not valid
      }
      throw error
    }
  }
}

module.exports = RefreshTokensAction
