const { RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { PostDAO } = require('../../../dao/PostDAO')
const { PostModel } = require('../../../models/PostModel')
const { privateItemPolicy } = require('../../../policy')

class GetPostByIdAction extends BaseAction {
  static get accessTag () {
    return 'posts:get-by-id'
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
    await privateItemPolicy(model, currentUser)

    return this.result({ data: model })
  }
}

module.exports = { GetPostByIdAction }
