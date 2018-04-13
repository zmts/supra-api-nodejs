const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { makeRefreshTokenService } = require('../../services/auth')

class AddRefreshTokensAction extends BaseAction {
  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static run (req, res, next) {
    this.validate(req, this.validationRules)
      .then(() => makeRefreshTokenService({ email: 'Piotr@gmail.com11sss' }))
      .then(refreshToken => {
        let data = {}
        let refreshTokenSplited = refreshToken.split('::')
        data['iv'] = refreshTokenSplited[0]
        data['token'] = refreshToken

        return data
      })
      .then(data => UserDAO.AddRefreshTokenByUserId(+req.params.id, data))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = AddRefreshTokensAction
