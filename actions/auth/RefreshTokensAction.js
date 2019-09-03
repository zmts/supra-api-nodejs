const addSession = require('./shared/addSession')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const AuthModel = require('../../models/AuthModel')
const SessionDAO = require('../../dao/SessionDAO')
const SessionEntity = require('./shared/SessionEntity')
const { makeAccessTokenService, verifySession } = require('../../services/auth')

class RefreshTokensAction extends BaseAction {
  static get accessTag () {
    return 'auth:refresh-tokens'
  }

  static get validationRules () {
    return {
      body: {
        refreshToken: [AuthModel.schema.refreshToken, true],
        fingerprint: [AuthModel.schema.fingerprint, true] // https://github.com/Valve/fingerprintjs2
      }
    }
  }

  static async run (ctx) {
    const reqRefreshToken = ctx.body.refreshToken
    const reqFingerprint = ctx.body.fingerprint

    const oldSession = await SessionDAO.getByRefreshToken(reqRefreshToken)
    await SessionDAO.baseRemoveWhere({ refreshToken: reqRefreshToken })
    await verifySession(oldSession, reqFingerprint)
    const user = await UserDAO.baseGetById(oldSession.userId)

    const newSession = new SessionEntity({
      userId: user.id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: reqFingerprint
    })

    await addSession(newSession)

    return this.result({
      data: {
        accessToken: await makeAccessTokenService(user),
        refreshToken: newSession.refreshToken
      }
    })
  }
}

module.exports = RefreshTokensAction
