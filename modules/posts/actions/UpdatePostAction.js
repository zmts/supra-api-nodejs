const { RequestRule } = require('supra-core')
const { BaseAction } = require('../../../rootcommmon/BaseAction')

const { PostDAO } = require('../../../dao/PostDAO')
const { PostModel } = require('../../../models/PostModel')
const { ownerPolicy } = require('../../../policy')

class UpdatePostAction extends BaseAction {
  static get accessTag () {
    return 'posts:update'
  }

  static get validationRules () {
    return {
      params: {
        id: new RequestRule(PostModel.schema.id, { required: true })
      },
      body: {
        title: new RequestRule(PostModel.schema.title),
        content: new RequestRule(PostModel.schema.content)
      },
      notEmptyBody: true
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx

    const model = await PostDAO.baseGetById(ctx.params.id)
    await ownerPolicy(model, currentUser)
    const data = await PostDAO.baseUpdate(ctx.params.id, ctx.body)

    return this.result({ data })
  }
}

module.exports = { UpdatePostAction }
