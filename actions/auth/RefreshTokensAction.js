const ms = require('ms')
const { RequestRule, CookieEntity, AppError, errorCodes } = require('supra-core')

const { addRefreshSession } = require('./common/addRefreshSession')
const { verifySession } = require('./common/verifySession')
const { makeAccessToken } = require('./common/makeAccessToken')
const { RefreshSessionEntity } = require('./common/RefreshSessionEntity')
const BaseAction = require('../BaseAction')
const { UserDAO } = require('../../dao/UserDAO')
const { AuthModel } = require('../../models/AuthModel')
const { RefreshSessionDAO } = require('../../dao/RefreshSessionDAO')
const config = require('../../config')

class RefreshTokensAction extends BaseAction {
  static get accessTag () {
    return 'auth:refresh-tokens'
  }

  static get validationRules () {
    return {
      body: {
        fingerprint: new RequestRule(AuthModel.schema.fingerprint, { required: true }), // https://github.com/Valve/fingerprintjs2
        refreshToken: new RequestRule(AuthModel.schema.refreshToken)
      },
      cookies: {
        refreshToken: new RequestRule(AuthModel.schema.refreshToken)
      }
    }
  }

  static async run (ctx) {
    // take refresh token from any possible source
    const reqRefreshToken = ctx.cookies.refreshToken || ctx.body.refreshToken
    const reqFingerprint = ctx.body.fingerprint

    if (!reqRefreshToken) {
      throw new AppError({ ...errorCodes.VALIDATION, message: 'Refresh token not provided' })
    }

    const refTokenExpiresInMilliseconds = new Date().getTime() + ms(config.token.refresh.expiresIn)
    const refTokenExpiresInSeconds = parseInt(refTokenExpiresInMilliseconds / 1000)

    const oldRefreshSession = await RefreshSessionDAO.getByRefreshToken(reqRefreshToken)
    await RefreshSessionDAO.baseRemoveWhere({ refreshToken: reqRefreshToken })
    await verifySession(new RefreshSessionEntity(oldRefreshSession), reqFingerprint)
    const user = await UserDAO.baseGetById(oldRefreshSession.userId)

    const newRefreshSession = new RefreshSessionEntity({
      userId: user.id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: reqFingerprint,
      expiresIn: refTokenExpiresInMilliseconds
    })

    await addRefreshSession(newRefreshSession)

    return this.result({
      data: {
        accessToken: await makeAccessToken(user),
        // return refresh token also in request body, just for debug
        refreshToken: newRefreshSession.refreshToken
      },
      cookies: [
        new CookieEntity({
          name: 'refreshToken',
          value: newRefreshSession.refreshToken,
          domain: 'localhost',
          path: '/auth',
          maxAge: refTokenExpiresInSeconds,
          secure: false // temp: should be deleted
        })
      ]
    })
  }
}

module.exports = RefreshTokensAction
