const ms = require('ms')
const { v4: uuidv4 } = require('uuid')
const { RequestRule, AppError, errorCodes, CookieEntity } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { addRefreshSession } = require('../common/addRefreshSession')
const { UserDAO } = require('../../../dao/UserDAO')
const { AuthModel } = require('../../../models/AuthModel')
const { RefreshSessionEntity } = require('../common/RefreshSessionEntity')
const { makeAccessToken } = require('../common/makeAccessToken')
const { checkPassword } = require('../../../rootcommmon/checkPassword')
const config = require('../../../config')

class LoginAction extends BaseAction {
  static get accessTag () {
    return 'auth:login'
  }

  static get validationRules () {
    return {
      body: {
        password: new RequestRule(AuthModel.schema.password, { required: true }),
        email: new RequestRule(AuthModel.schema.email, { required: true }),
        fingerprint: new RequestRule(AuthModel.schema.fingerprint, { required: true })
      }
    }
  }

  static async run (ctx) {
    let user = {}
    const refTokenExpiresInMilliseconds = new Date().getTime() + ms(config.token.refresh.expiresIn)
    const refTokenExpiresInSeconds = parseInt(refTokenExpiresInMilliseconds / 1000)

    try {
      user = await UserDAO.getByEmail(ctx.body.email)
      await checkPassword(ctx.body.password, user.passwordHash)
    } catch (e) {
      if ([errorCodes.NOT_FOUND.code, errorCodes.INVALID_PASSWORD.code].includes(e.code)) {
        throw new AppError({ ...errorCodes.INVALID_CREDENTIALS })
      }
      throw e
    }

    const newRefreshSession = new RefreshSessionEntity({
      refreshToken: uuidv4(),
      userId: user.id,
      ip: ctx.ip,
      ua: ctx.headers['User-Agent'],
      fingerprint: ctx.body.fingerprint,
      expiresIn: refTokenExpiresInMilliseconds
    })

    await addRefreshSession(newRefreshSession)

    return this.result({
      data: {
        accessToken: await makeAccessToken(user),
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

module.exports = { LoginAction }
