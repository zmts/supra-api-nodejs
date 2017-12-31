const Joi = require('joi')
const BaseAction = require('../base')

/**
 * @description return users list
 */
class List extends BaseAction {
  get name () {
    return 'users-list'
  }

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
    this.validate(req, this.validationRules)
      .then(() => res.json({ data: 'users list' }))
      .catch(error => next(error))
  }
}

module.exports = List
