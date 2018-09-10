const Joi = require('joi')

const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const UpdatePostModel = require('../../models/post/UpdatePostModel')
const PostModel = require('../../models/post/PostModel')

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

  static async run (req, res, next) {
    try {
      await this.init(req, this.validationRules, this.accessTag)
      const model = await PostDAO.BaseGetById(+req.params.id)
      this.checkAccessByOwnerId(model)
      const updatedModel = await PostDAO.BaseUpdate(+req.params.id, new UpdatePostModel(req.body))
      res.json(this.resJson({ data: new PostModel(updatedModel) }))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UpdateAction
