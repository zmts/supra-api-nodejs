const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

/**
 * @description return users list
 */
class ListAction extends BaseAction {
  static get accessTag () {
    return 'users:list'
  }

  static async run (req, res) {
    const { query } = req
    const data = await UserDAO.BaseGetList({ ...query })
    res.json(this.resJson({ data }))
  }
}

module.exports = ListAction
