const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class GetPostsByUserIdAction extends BaseAction {
  static get accessTag () {
    return 'users:get-posts-by-user-id'
  }

  static async run (req, res) {
    const { query } = req
    const data = await PostDAO.GetPostsByUserId(+req.params.id, {
      ...query,
      orderBy: { field: 'title', direction: 'asc' }
    })
    res.json(this.resJson({ data }))
  }
}

module.exports = GetPostsByUserIdAction
