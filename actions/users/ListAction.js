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

  static run (req, res, next) {
    this.init(req, this.validationRules, this.accessTag)
      .then(() => this.queryResolver(req.query, this.queryProps))
      .then(() => UserDAO.BaseGetList())
      .then(list => res.json(this.resJson({ data: list })))
      .catch(error => next(error))
  }
}

module.exports = ListAction
