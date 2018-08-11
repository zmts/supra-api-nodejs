const Joi = require('joi')

const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const registry = require('../../registry')

class CreateAction extends BaseAction {
  static get accessTag () {
    return 'posts:create'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules,
      body: Joi.object().keys({
        title: Joi.string().min(3).max(20),
        content: Joi.string().min(3).max(5000)
      })
    }
  }

  static run (req, res, next) {
    let currentUser = registry.currentUser.get()

    this.init(req, this.validationRules, this.accessTag)
      .then(() => PostDAO.BaseCreate({ ...req.body, userId: currentUser.id }))
      .then(createdModel => res.json(this.resJson({ data: createdModel })))
      .catch(error => next(error))
  }
}

module.exports = CreateAction
