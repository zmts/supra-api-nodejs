const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { checkPasswordService, makeAccessTokenService, makeRefreshTokenService } = require('../../services/auth')

class LoginAction extends BaseAction {
  static get accessTag () {
    return 'auth:login'
  }

  static get validationRules () {
    return {
      body: Joi.object().keys({
        password: Joi.string().required(),
        email: Joi.string().email().min(6).max(30).required()
      })
    }
  }

  static async run (req) {
    let data = { accessToken: '', refreshToken: '' }

    const user = await UserDAO.GetByEmail(req.body.email)
    await checkPasswordService(req.body.password, user.passwordHash)
    data.accessToken = await makeAccessTokenService(user)
    data.refreshToken = await makeRefreshTokenService(user)
    const refreshTokenTimestamp = data.refreshToken.split('::')[0]
    await UserDAO.AddRefreshTokenProcess(user, {
      timestamp: refreshTokenTimestamp,
      refreshToken: data.refreshToken
    })

    return this.result({ data })
  }
}

module.exports = LoginAction
