const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class ListAction extends BaseAction {
  static get accessTag () {
    return 'posts:list'
  }

  static get queryProps () {
    return {}
  }

  static async run (req, res) {
    this.queryResolver(req.query, this.queryProps)
    const data = await PostDAO.BaseGetList()
    res.json(this.resJson({ data }))
  }
}

module.exports = ListAction
