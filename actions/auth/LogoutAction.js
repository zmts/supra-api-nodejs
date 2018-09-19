const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

class LogoutAction extends BaseAction {
  static get accessTag () {
    return 'auth:logout'
  }

  static async run (req, res) {
    const { currentUser } = this.context(req)
    await UserDAO.BaseUpdate(currentUser.id, { refreshTokensMap: {} })
    res.json(this.resJson({ message: 'User is logged out' }))
  }
}

module.exports = LogoutAction
