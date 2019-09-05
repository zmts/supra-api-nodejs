const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const PostModel = require('../../models/PostModel')
const { checkAccessByOwnerIdService } = require('../../services/security')

class RemovePostAction extends BaseAction {
  static get accessTag () {
    return 'posts:delete'
  }

  static get validationRules () {
    return {
      params: {
        id: [PostModel.schema.id, true]
      }
    }
  }

  static async run (req) {
    const { currentUser } = req

    const model = await PostDAO.baseGetById(+req.params.id)
    await checkAccessByOwnerIdService(model, currentUser)
    await PostDAO.baseRemove(+req.params.id)

    return this.result({ message: `${req.params.id} was removed` })
  }
}

module.exports = RemovePostAction
