const ms = require('ms')
const { RequestRule, CookieEntity, AppError, errorCodes } = require('supra-core')

const { addSession } = require('./common/addSession')
const { verifySession } = require('./common/verifySession')
const { makeAccessToken } = require('./common/makeAccessToken')
const { SessionEntity } = require('./common/SessionEntity')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const AuthModel = require('../../models/AuthModel')
const SessionDAO = require('../../dao/SessionDAO')
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

    const oldSession = await SessionDAO.getByRefreshToken(reqRefreshToken)
    await SessionDAO.baseRemoveWhere({ refreshToken: reqRefreshToken })
    await verifySession(new SessionEntity(oldSession), reqFingerprint)
    const user = await UserDAO.baseGetById(oldSession.userId)

    const newSession = new SessionEntity({
      userId: user.id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: reqFingerprint,
      expiresIn: refTokenExpiresInMilliseconds
    })

    await addSession(newSession)

    return this.result({
      data: {
        accessToken: await makeAccessToken(user),
        // return refresh token also in request body, just for debug
        refreshToken: newSession.refreshToken
      },
      cookies: [
        new CookieEntity({
          name: 'refreshToken',
          value: newSession.refreshToken,
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
