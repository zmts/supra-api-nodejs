const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const registry = require('../../registry')

class GetCurrentUserAction extends BaseAction {
  static get accessTag () {
    return 'users:get-current-user'
  }

  static async run (req, res) {
    const currentUser = registry.currentUser.get()
    const data = await UserDAO.BaseGetById(currentUser.id)
    res.json(this.resJson({ data }))
  }

}

module.exports = GetCurrentUserAction
