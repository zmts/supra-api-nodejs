const Joi = require('joi')
const BaseAction = require('../Base')
const UserRepo = require('../../repository/User')

/**
 * @description return users list
 */
class List extends BaseAction {
  get permissions () {
    return {
      anonymous: false,
      admin: true,
      editor: true
    }
  }

  get validationRules () {
    return {
      ...this.baseValidationRules,
      query: Joi.object().keys({
        q: Joi.string().min(2).max(50)
      })
    }
  }

  run (req, res, next) {
    req.meta.user.role = 'editor' // temp mock data

    this.checkAccess(req.meta.user, this.permissions)
      .then(() => this.validate(req, this.validationRules))
      .then(() => UserRepo.GETall())
      .then(data => res.json({ data }))
      .catch(error => next(error))
  }
}

module.exports = List
