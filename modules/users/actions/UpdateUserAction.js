const { RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')
const { UserModel } = require('../../../models/UserModel')

class UpdateUserAction extends BaseAction {
  static get accessTag () {
    return 'users:update'
  }

  static get validationRules () {
    return {
      body: {
        name: new RequestRule(UserModel.schema.name),
        location: new RequestRule(UserModel.schema.location)
      }
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx
    const data = await UserDAO.baseUpdate(currentUser.id, ctx.body) // user can update only itself

    return this.result({ data })
  }
}

module.exports = { UpdateUserAction }
