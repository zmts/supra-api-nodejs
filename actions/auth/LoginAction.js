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
      ...this.baseValidationRules,
      body: Joi.object().keys({
        password: Joi.string().required(),
        email: Joi.string().email().min(6).max(30).required()
      })
    }
  }

  static run (req, res, next) {
    let userEntity = {}
    let data = { accessToken: '', refreshToken: '' }

    this.init(req, this.validationRules, this.accessTag)
      .then(() => UserDAO.GetByEmail(req.body.email))
      .then(user => {
        userEntity = user
        return checkPasswordService(req.body.password, user.passwordHash)
      })
      .then(() => makeAccessTokenService(userEntity))
      .then(accessToken => (data.accessToken = accessToken))
      .then(() => makeRefreshTokenService(userEntity))
      .then(refreshToken => {
        data.refreshToken = refreshToken
        let refreshTokenTimestamp = refreshToken.split('::')[0]
        return UserDAO.AddRefreshTokenProcess(userEntity, { timestamp: refreshTokenTimestamp, refreshToken })
      })
      .then(() => res.json(this.resJson({ data })))
      .catch(error => next(error))
  }
}

module.exports = LoginAction
