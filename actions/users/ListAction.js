const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

/**
 * @description return users list
 */
class ListAction extends BaseAction {
  static get accessTag () {
    return 'users:list'
  }

  static get queryProps () {
    return {
      ...this.baseQueryProps
    }
  }

  static async run (req, res) {
    this.queryResolver(req.query, this.queryProps)
    const data = await UserDAO.BaseGetList()
    res.json(this.resJson({ data }))
  }
}

module.exports = ListAction
