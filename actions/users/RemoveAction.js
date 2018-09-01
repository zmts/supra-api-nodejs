const BaseAction = require('../BaseAction')
const UserDAO = require('../../dao/UserDAO')
const { checkAccessUpdateUserService } = require('../../services/security')

class RemoveAction extends BaseAction {
  static get accessTag () {
    return 'users:remove'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static run (req, res, next) {
    this.init(req, this.validationRules, this.accessTag)
      .then(() => UserDAO.BaseGetById(+req.params.id))
      .then(model => checkAccessUpdateUserService(model))
      .then(() => UserDAO.BaseRemove(+req.params.id))
      .then(() => res.json(this.resJson({ message: `${req.params.id} was removed` })))
      .catch(error => next(error))
  }
}

module.exports = RemoveAction
