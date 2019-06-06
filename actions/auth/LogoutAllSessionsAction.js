const BaseAction = require('../BaseAction')
const SessionDAO = require('../../dao/SessionDAO')

class LogoutAllSessionsAction extends BaseAction {
  static get accessTag () {
    return 'auth:logout-all-sessions'
  }

  static async run (ctx) {
    const { currentUser } = ctx
    await SessionDAO.baseRemoveWhere({ userId: currentUser.id })

    return this.result({ message: 'User is logged out from all sessions.' })
  }
}

module.exports = LogoutAllSessionsAction
