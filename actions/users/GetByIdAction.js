const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

/**
 * @description return user by id
 */
class GetByIdAction extends BaseAction {
  static get accessTag () {
    return 'users:get-by-id'
  }

  static async run (req, res) {
    const model = await UserDAO.BaseGetById(+req.params.id)
    res.json(this.resJson({ data: model }))
  }
}

module.exports = GetByIdAction
