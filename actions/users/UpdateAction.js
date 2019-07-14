const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

class UpdateAction extends BaseAction {
  static get accessTag () {
    return 'users:update'
  }

  static get validationRules () {
    return {
      body: this.joi.object().keys({
        name: this.joi.string().min(3).max(50),
        location: this.joi.string().min(3).max(300)
      })
    }
  }

  static async run (req) {
    const { currentUser } = req
    const data = await UserDAO.baseUpdate(currentUser.id, req.body) // user can update only itself

    return this.result({ data })
  }
}

module.exports = UpdateAction
