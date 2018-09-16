const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const registry = require('../../registry')

class LogoutAction extends BaseAction {
  static get accessTag () {
    return 'auth:logout'
  }

  static async run (req, res, next) {
    const currentUser = registry.currentUser.user
    await UserDAO.BaseUpdate(currentUser.id, { refreshTokensMap: {} })
    res.json(this.resJson({ message: 'User is logged out' }))
  }
}

module.exports = LogoutAction
