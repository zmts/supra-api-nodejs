const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')

/**
 * @description return user by id
 */
class GetByIdAction extends BaseAction {
  static get accessTag () {
    return 'users:get-by-id'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static run (req, res, next) {
    this.init(req, this.validationRules, this.accessTag)
      .then(() => UserDAO.BaseGetById(+req.params.id))
      .then(model => this.checkAccessToPrivateItem(model))
      .then(model => res.json({ data: model, success: true }))
      .catch(error => next(error))
  }
}

module.exports = GetByIdAction
