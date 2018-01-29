const BaseAction = require('../Base')
const UserRepository = require('../../repository/UserRepository')

/**
 * @description create user entity
 */
class GetByIdAction extends BaseAction {
  get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  run (req, res, next) {
    this.validate(req, this.validationRules)
      .then(() => UserRepository.GETById(req.params.id))
      .then(data => res.json({ data }))
      .catch(error => next(error))
  }
}

module.exports = GetByIdAction
