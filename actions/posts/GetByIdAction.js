const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const { checkAccessToPrivateItemService } = require('../../services/security')

class GetByIdAction extends BaseAction {
  static get accessTag () {
    return 'posts:get-by-id'
  }

  static async run (req) {
    const { currentUser } = req

    const model = await PostDAO.BaseGetById(+req.params.id)
    await checkAccessToPrivateItemService(model, currentUser)

    return this.result({ data: model })
  }
}

module.exports = GetByIdAction
