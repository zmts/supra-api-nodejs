const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

class LogoutAction extends BaseAction {
  static get accessTag () {
    return 'auth:logout'
  }

  static async run (req) {
    const { currentUser } = req
    await UserDAO.BaseUpdate(currentUser.id, { refreshTokensMap: {} })

    return this.result({ message: 'User is logged out' })
  }
}

module.exports = LogoutAction
