const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

/**
 * @description return users list
 */
class ListAction extends BaseAction {
  static get accessTag () {
    return 'users:list'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static get queryProps () {
    return {
      ...this.baseQueryProps
    }
  }

  static async run (req, res, next) {
    try {
      await this.init(req, this.validationRules, this.accessTag)
      await this.queryResolver(req.query, this.queryProps)
      const list = await UserDAO.BaseGetList()
      res.json(this.resJson({ data: list }))
    } catch (error) { next(error) }
  }
}

module.exports = ListAction
