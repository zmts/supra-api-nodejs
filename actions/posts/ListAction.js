const BaseAction = require('../BaseAction')
const PostDAO = require('../../dao/PostDAO')

class ListAction extends BaseAction {
  static get accessTag () {
    return 'posts:list'
  }

  static get validationRules () {
    return {
      ...this.baseValidationRules
    }
  }

  static get queryProps () {
    return {
      ...this.baseQueryProps
    }
  }

  static async run (req, res, next) {
    try {
      await this.init(req, this.validationRules, this.accessTag)
      await this.queryResolver(req.query, this.queryProps)
      const data = await PostDAO.BaseGetList()
      res.json(this.resJson({ data }))
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ListAction
