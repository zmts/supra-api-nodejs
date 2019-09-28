const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const PostModel = require('../../models/PostModel')
const { ownerPolicy } = require('../../policy')

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

  static async run (req) {
    const { currentUser } = req

    const model = await PostDAO.baseGetById(+req.params.id)
    await ownerPolicy(model, currentUser)
    const data = await PostDAO.baseUpdate(+req.params.id, req.body)

    return this.result({ data })
  }
}

module.exports = UpdatePostAction
