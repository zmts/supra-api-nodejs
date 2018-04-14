const Joi = require('joi')

const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const authModule = require('../../services/auth')

class LoginAction extends BaseAction {
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
    let data = { accessToken: '', refreshToken: '', expiresIn: 0 }

    this.validate(req, this.validationRules)
      .then(() => UserDAO.GetByEmail(req.body.email))
      .then(user => {
        userEntity = user
        return authModule.checkPasswordService(req.body.password, user.passwordHash)
      })
      .then(() => authModule.makeAccessTokenService(userEntity))
      .then(accessTokenObj => {
        data.accessToken = accessTokenObj.accessToken
        data.expiresIn = accessTokenObj.expiresIn
      })
      .then(() => authModule.makeRefreshTokenService(userEntity))
      .tap(refreshToken => {
        let iv = refreshToken.split('::')[0]
        return UserDAO.AddRefreshToken(+userEntity.id, { iv, refreshToken })
      })
      .then(refreshToken => (data.refreshToken = refreshToken))
      .then(() => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = LoginAction
