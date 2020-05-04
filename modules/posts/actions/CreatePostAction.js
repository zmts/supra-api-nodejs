const { RequestRule } = require('supra-core')

const { BaseAction } = require('../../../rootcommmon/BaseAction')
const { PostDAO } = require('../../../dao/PostDAO')
const { PostModel } = require('../../../models/PostModel')

class CreatePostAction extends BaseAction {
  static get accessTag () {
    return 'posts:create'
  }

  static get validationRules () {
    return {
      body: {
        title: new RequestRule(PostModel.schema.title, { required: true }),
        content: new RequestRule(PostModel.schema.content, { required: true })
      }
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx
    const data = await PostDAO.baseCreate({ ...ctx.body, userId: currentUser.id })
    return this.result({ data })
  }
}

module.exports = { CreatePostAction }
