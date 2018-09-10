const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class RemoveAction extends BaseAction {
  static get accessTag () {
    return 'posts:delete'
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
      await this.checkAccessByOwnerId(model)
      await PostDAO.BaseRemove(+req.params.id)
      res.json(this.resJson({ message: `${req.params.id} was removed` }))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = RemoveAction
