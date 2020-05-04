const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { RefreshSessionDAO } = require('../../../dao/RefreshSessionDAO')

class LogoutAllSessionsAction extends BaseAction { // TODO logout from all sessions except current
  static get accessTag () {
    return 'auth:logout-all-sessions'
  }

  static async run (ctx) {
    const { currentUser } = ctx
    await RefreshSessionDAO.baseRemoveWhere({ userId: currentUser.id })

    return this.result({ message: 'User is logged out from all sessions.' })
  }
}

module.exports = { LogoutAllSessionsAction }
