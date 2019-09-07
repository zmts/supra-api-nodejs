const { RequestRule } = require('supra-core')
const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const PostModel = require('../../models/PostModel')
const { ownerPolicy } = require('../../policy')

class RemovePostAction extends BaseAction {
  static get accessTag () {
    return 'posts:delete'
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

    const model = await PostDAO.baseGetById(+req.params.id)
    await ownerPolicy(model, currentUser)
    await PostDAO.baseRemove(+req.params.id)

    return this.result({ message: `${req.params.id} was removed` })
  }
}

module.exports = RemovePostAction
