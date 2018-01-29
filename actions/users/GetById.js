const BaseAction = require('../Base')
const UserRepo = require('../../repository/User')

/**
 * @description create user entity
 */
class GetById extends BaseAction {
  get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  run (req, res, next) {
    this.validate(req, this.validationRules)
      .then(() => UserRepo.GETById(req.params.id))
      .then(model => res.json({ data: model }))
      .catch(error => next(error))
  }
}

module.exports = GetById
