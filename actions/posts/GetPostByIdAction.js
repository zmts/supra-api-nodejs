const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const PostModel = require('../../models/PostModel')
const { privateItemPolicy } = require('../../policy')

class GetPostByIdAction extends BaseAction {
  static get accessTag () {
    return 'posts:get-by-id'
  }

  static get validationRules () {
    return {
      params: {
        id: new RequestRule(PostModel.schema.id, true)
      }
    }
  }

  static async run (req) {
    const { currentUser } = req

    const model = await PostDAO.baseGetById(req.params.id)
    await privateItemPolicy(model, currentUser)

    return this.result({ data: model })
  }
}

module.exports = GetPostByIdAction
