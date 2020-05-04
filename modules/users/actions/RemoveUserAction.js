const { RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')
const { UserModel } = require('../../../models/UserModel')
const { updateUserPolicy } = require('../../../policy')

class RemoveUserAction extends BaseAction {
  static get accessTag () {
    return 'users:remove'
  }

  static get validationRules () {
    return {
      params: {
        id: new RequestRule(UserModel.schema.id, { required: true })
      }
    }
  }

  static async run (req) {
    const { currentUser } = req
    const id = req.params.id

    const model = await UserDAO.baseGetById(id)
    await updateUserPolicy(model, currentUser)
    await UserDAO.baseRemove(id)

    return this.result({ message: `${id} was removed` })
  }
}

module.exports = { RemoveUserAction }
