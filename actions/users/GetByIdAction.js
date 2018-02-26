const BaseAction = require('../BaseAction')
const User = require('../../models/User')

/**
 * @description return user by id
 */
class GetByIdAction extends BaseAction {
  get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  run (req, res, next) {
    this.validate(req, this.validationRules)
      .then(() => User.GETbyId(req.params.id))
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = GetByIdAction
