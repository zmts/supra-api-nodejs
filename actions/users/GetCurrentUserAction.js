const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

class GetCurrentUserAction extends BaseAction {
  static get accessTag () {
    return 'users:get-current-user'
  }

  static async run (req, res) {
    const { currentUser } = req
    const data = await UserDAO.BaseGetById(currentUser.id)
    res.json(this.resJson({ data }))
  }
}

module.exports = GetCurrentUserAction
