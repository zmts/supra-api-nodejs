const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')

class GetCurrentUserAction extends BaseAction {
  static get accessTag () {
    return 'users:get-current-user'
  }

  static async run (ctx) {
    const { currentUser } = ctx
    const data = await UserDAO.getCurrentUser(currentUser.id)

    return this.result({ data })
  }
}

module.exports = { GetCurrentUserAction }
