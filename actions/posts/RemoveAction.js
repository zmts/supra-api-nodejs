const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class RemoveAction extends BaseAction {
  static get accessTag () {
    return 'posts:delete'
  }

  static async run (req, res) {
    const { currentUser } = this.context(req)

    const model = await PostDAO.BaseGetById(+req.params.id)
    await this.checkAccessByOwnerId(model, currentUser)
    await PostDAO.BaseRemove(+req.params.id)

    res.json(this.resJson({ message: `${req.params.id} was removed` }))
  }
}

module.exports = RemoveAction
