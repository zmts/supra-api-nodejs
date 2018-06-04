const Joi = require('joi')

const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

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
    this.validate(req, this.validationRules)
      .then(() => this.checkAccessByTag(this.accessTag))
      .then(() => PostDAO.BaseCreate(req.body))
      .then(createdModel => res.json({ data: createdModel, success: true }))
      .catch(error => next(error))
  }
}

module.exports = CreateAction
