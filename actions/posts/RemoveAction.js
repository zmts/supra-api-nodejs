const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const { checkAccessByOwnerIdService } = require('../../services/security')

class RemoveAction extends BaseAction {
  static get accessTag () {
    return 'posts:delete'
  }

  static async run (req, res) {
    const { currentUser } = req

    const model = await PostDAO.BaseGetById(+req.params.id)
    await checkAccessByOwnerIdService(model, currentUser)
    await PostDAO.BaseRemove(+req.params.id)

    res.json(this.resJson({ message: `${req.params.id} was removed` }))
  }
}

module.exports = RemoveAction
