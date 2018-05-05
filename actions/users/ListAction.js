const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

/**
 * @description return users list
 */
class ListAction extends BaseAction {
  static get permissions () {
    return {
      anonymous: false,
      admin: true,
      editor: true
    }
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static get queryConfig () {
    return {
      limit: 20,
      orderBy: 'name:asc'
    }
  }

  static run (req, res, next) {
    req.meta = { user: { role: 'editor' } } // temp mock data

    this.validate(req, this.validationRules)
      .then(() => this.checkAccess(req.meta.user, this.permissions))
      .then(() => UserDAO.GET_LIST())
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = ListAction
