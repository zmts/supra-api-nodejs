const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const PostModel = require('../../models/PostModel')
const { checkAccessByOwnerIdService } = require('../../services/security')

class UpdateAction extends BaseAction {
  static get accessTag () {
    return 'posts:update'
  }

  static get validationRules () {
    return {
      params: {
        id: [PostModel.schema.id, true]
      },
      body: {
        title: [PostModel.schema.title],
        content: [PostModel.schema.content]
      },
      notEmptyBody: true
    }
  }

  static async run (req) {
    const { currentUser } = req

    const model = await PostDAO.baseGetById(+req.params.id)
    await checkAccessByOwnerIdService(model, currentUser)
    const data = await PostDAO.baseUpdate(+req.params.id, req.body)

    return this.result({ data })
  }
}

module.exports = UpdateAction
