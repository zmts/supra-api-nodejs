const addSession = require('./shared/addSession')
const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const SessionEntity = require('../../entities/SessionEntity')
const { checkPasswordService, makeAccessTokenService } = require('../../services/auth')

class LoginAction extends BaseAction {
  static get accessTag () {
    return 'auth:login'
  }

  static get validationRules () {
    return {
      body: this.joi.object().keys({
        password: this.joi.string().required(),
        email: this.joi.string().email().min(6).max(30).required(),
        fingerprint: this.joi.string().max(200).required() // https://github.com/Valve/fingerprintjs2
      })
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

    await addSession({ session: newSession, user })

    return this.result({
      data: {
        accessToken: await makeAccessTokenService(user),
        refreshToken: newSession.refreshToken
      }
    })
  }
}

module.exports = LoginAction
