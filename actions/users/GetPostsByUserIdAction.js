const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class GetPostsByUserIdAction extends BaseAction {
  static get accessTag () {
    return 'users:get-posts-by-user-id'
  }

  static get queryProps () {
    return {}
  }

  static async run (req, res) {
    this.queryResolver(req.query, this.queryProps)
    const data = await PostDAO.GetPostsByUserId(+req.params.id)
    res.json(this.resJson({ data }))
  }
}

module.exports = GetPostsByUserIdAction
