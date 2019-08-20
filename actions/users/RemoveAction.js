const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const UserModel = require('../../models/UserModel')
const { checkAccessUpdateUserService } = require('../../services/security')

class RemoveAction extends BaseAction {
  static get accessTag () {
    return 'users:remove'
  }

  static get validationRules () {
    return {
      params: {
        id: [UserModel.schema.id, true]
      }
    }
  }

  static async run (req) {
    const { currentUser } = req
    const id = req.params.id

    const model = await UserDAO.baseGetById(id)
    await checkAccessUpdateUserService(model, currentUser)
    await UserDAO.baseRemove(id)

    return this.result({ message: `${id} was removed` })
  }
}

module.exports = RemoveAction
