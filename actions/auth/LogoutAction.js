const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const registry = require('../../registry')

class LogoutAction extends BaseAction {
  static get accessTag () {
    return 'auth:logout'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static run (req, res, next) {
    let currentUser = registry.getCurrentUser()

    this.init(req, this.validationRules, this.accessTag)
      .then(() => UserDAO.BaseUpdate(currentUser.id, { refreshTokensMap: {} }))
      .then(() => res.json(this.resJson({ message: 'User is logged out' })))
      .catch(error => next(error))
  }
}

module.exports = LogoutAction
