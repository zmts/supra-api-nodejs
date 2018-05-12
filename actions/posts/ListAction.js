const Joi = require('joi')
const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

/**
 * @description return users list
 */
class ListAction extends BaseAction {
  static get accessTag () {
    return 'posts:list'
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
    this.checkAccess(this.accessTag)
      .then(() => this.validate(req, this.validationRules))
      .then(() => PostDAO.GET_LIST())
      .then(data => res.json({ data, success: true }))
      .catch(error => next(error))
  }
}

module.exports = ListAction
