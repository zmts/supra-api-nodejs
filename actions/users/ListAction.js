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

  static get queryConfig () {
    return {
      limit: 20,
      orderBy: 'name:asc',
      filter: {
        // todo
      }
    }
  }

  static run (req, res, next) {
    this.init(req, this.validationRules, this.accessTag)
      .then(() => UserDAO.BaseGetList())
      .then(list => res.json(this.resJson({ data: list })))
      .catch(error => next(error))
  }
}

module.exports = ListAction
