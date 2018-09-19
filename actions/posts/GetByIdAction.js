const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class GetByIdAction extends BaseAction {
  static get accessTag () {
    return 'posts:get-by-id'
  }

  static async run (req, res) {
    const { currentUser } = this.context(req)

    const model = await PostDAO.BaseGetById(+req.params.id)
    await this.checkAccessToPrivateItem(model, currentUser)

    res.json(this.resJson({ data: model }))
  }
}

module.exports = GetByIdAction
