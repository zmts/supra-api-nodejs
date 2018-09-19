const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class ListAction extends BaseAction {
  static get accessTag () {
    return 'posts:list'
  }

  static async run (req, res) {
    const { query } = this.context(req)
    const data = await PostDAO.BaseGetList({ ...query })
    res.json(this.resJson({ data }))
  }
}

module.exports = ListAction
