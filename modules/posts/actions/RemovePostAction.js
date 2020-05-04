const { RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { PostDAO } = require('../../../dao/PostDAO')
const { PostModel } = require('../../../models/PostModel')
const { ownerPolicy } = require('../../../policy')

class RemovePostAction extends BaseAction {
  static get accessTag () {
    return 'posts:delete'
  }

  static get validationRules () {
    return {
      params: {
        id: new RequestRule(PostModel.schema.id, { required: true })
      }
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx

    const model = await PostDAO.baseGetById(ctx.params.id)
    await ownerPolicy(model, currentUser)
    await PostDAO.baseRemove(ctx.params.id)

    return this.result({ message: `${ctx.params.id} was removed` })
  }
}

module.exports = { RemovePostAction }
