const Joi = require('joi')

const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class UpdateAction extends BaseAction {
  static get accessTag () {
    return 'posts:update'
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
      .then(() => PostDAO.BaseGetById(+req.params.id))
      .then(model => this.checkAccessByOwnerId(model))
      .then(() => PostDAO.BaseUpdate(+req.params.id, req.body))
      .then(updatedModel => res.json({ data: updatedModel, success: true }))
      .catch(error => next(error))
  }
}

module.exports = UpdateAction
