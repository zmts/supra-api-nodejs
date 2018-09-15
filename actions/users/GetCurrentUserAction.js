const BaseAction = require('../BaseAction')
const GetCurrentUserLogic = require('../../logic/users/GetCurrentUserLogic')

class GetCurrentUserAction extends BaseAction {
  static get accessTag () {
    return 'users:get-current-user'
  }

  static async run (req, res) {
    const data = await GetCurrentUserLogic.exec({
      currentUserId: this.currentUser.id
    })
    res.json(this.resJson({ data }))
  }

}

module.exports = GetCurrentUserAction
