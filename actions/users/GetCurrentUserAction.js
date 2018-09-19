const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

class GetCurrentUserAction extends BaseAction {
  static get accessTag () {
    return 'users:get-current-user'
  }

  static async run (req, res) {
    const data = await UserDAO.BaseGetById(this.currentUser.id)
    res.json(this.resJson({ data }))
  }
}

module.exports = GetCurrentUserAction
