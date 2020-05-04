const { RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { UserDAO } = require('../../../dao/UserDAO')
const { UserModel } = require('../../../models/UserModel')

/**
 * @description return user by id
 */
class GetUserByIdAction extends BaseAction {
  static get accessTag () {
    return 'users:get-by-id'
  }

  static get validationRules () {
    return {
      params: {
        id: new RequestRule(UserModel.schema.id, { required: true })
      }
    }
  }

  static async run (ctx) {
    const model = await UserDAO.baseGetById(ctx.params.id)

    return this.result({ data: model })
  }
}

module.exports = { GetUserByIdAction }
