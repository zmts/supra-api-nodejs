const Joi = require('joi')
const BaseAction = require('../base')

/**
 * @description return users list
 */
class List extends BaseAction {
  static get permissions () {
    return {
      anonymous: false,
      admin: true,
      editor: false
    }
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules,
      query: Joi.object().keys({
        q: Joi.string().min(2).max(50)
      })
    }
  }

  static run (req, res, next) {
    req.meta.user.role = 'editor' // temp mock data

    this.checkAccess(req.meta.user, this.permissions)
      .then(() => this.validate(req, this.validationRules))
      .then(() => res.json({ data: 'users list' }))
      .catch(error => next(error))
  }
}

module.exports = List
