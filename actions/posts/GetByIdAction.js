const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')
const PostModel = require('../../models/post/PostModel')

class GetByIdAction extends BaseAction {
  static get accessTag () {
    return 'posts:get-by-id'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static async run (req, res, next) {
    try {
      await this.init(req, this.validationRules, this.accessTag)
      const model = await PostDAO.BaseGetById(+req.params.id)
      await this.checkAccessToPrivateItem(model)
      res.json(this.resJson({ data: new PostModel(model) }))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = GetByIdAction
