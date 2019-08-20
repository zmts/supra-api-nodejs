const addSession = require('./shared/addSession')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const AuthModel = require('../../models/AuthModel')
const SessionEntity = require('../../entities/SessionEntity')
const { checkPasswordService, makeAccessTokenService } = require('../../services/auth')

class LoginAction extends BaseAction {
  static get accessTag () {
    return 'auth:login'
  }

  static get validationRules () {
    return {
      body: {
        password: [AuthModel.schema.password, true],
        email: [AuthModel.schema.email, true],
        fingerprint: [AuthModel.schema.fingerprint, true]
      }
    }
  }

  static async run (ctx) {
    const user = await UserDAO.getByEmail(ctx.body.email)
    await checkPasswordService(ctx.body.password, user.passwordHash)

    const newSession = new SessionEntity({
      userId: user.id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: ctx.body.fingerprint
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

module.exports = LoginAction
