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

  static run (req, res, next) {
    req.meta = { user: { role: 'editor' } } // temp mock data

    this.validate(req, this.validationRules)
      .then(() => this.checkAccess(req.meta.user, this.permissions))
      .then(() => UserDAO.GETList())
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = ListAction
