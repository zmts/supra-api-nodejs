const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const PostModel = require('../../models/PostModel')

class CreateAction extends BaseAction {
  static get accessTag () {
    return 'posts:create'
  }

  static get validationRules () {
    return {
      body: {
        title: [PostModel.schema.title, true],
        content: [PostModel.schema.content, true]
      }
    }
  }

  static async run (ctx) {
    const { currentUser } = ctx
    const data = await PostDAO.baseCreate({ ...ctx.body, userId: currentUser.id })
    return this.result({ data })
  }
}

module.exports = CreateAction
